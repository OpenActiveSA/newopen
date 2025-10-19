-- Open Active Database Schema
-- This file contains the complete database schema for the Open Active tennis booking system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('openactive_user', 'club_manager', 'member', 'visitor');
CREATE TYPE club_relationship_type AS ENUM ('manager', 'member', 'visitor');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    role user_role DEFAULT 'member',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clubs table
CREATE TABLE public.clubs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo_url TEXT,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Club relationships table (many-to-many between users and clubs)
CREATE TABLE public.club_relationships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
    relationship_type club_relationship_type NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, club_id)
);

-- Courts table
CREATE TABLE public.courts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    court_type TEXT DEFAULT 'tennis', -- tennis, badminton, squash, etc.
    hourly_rate DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
    court_id UUID REFERENCES public.courts(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status booking_status DEFAULT 'pending',
    total_amount DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_clubs_slug ON public.clubs(slug);
CREATE INDEX idx_club_relationships_user_id ON public.club_relationships(user_id);
CREATE INDEX idx_club_relationships_club_id ON public.club_relationships(club_id);
CREATE INDEX idx_courts_club_id ON public.courts(club_id);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_club_id ON public.bookings(club_id);
CREATE INDEX idx_bookings_court_id ON public.bookings(court_id);
CREATE INDEX idx_bookings_start_time ON public.bookings(start_time);
CREATE INDEX idx_events_club_id ON public.events(club_id);
CREATE INDEX idx_events_start_time ON public.events(start_time);

-- Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "OpenActive users can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'openactive_user'
        )
    );

-- Clubs policies
CREATE POLICY "Anyone can view active clubs" ON public.clubs
    FOR SELECT USING (is_active = true);

CREATE POLICY "Club managers can update their clubs" ON public.clubs
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.club_relationships cr
            WHERE cr.club_id = clubs.id 
            AND cr.user_id = auth.uid() 
            AND cr.relationship_type = 'manager'
            AND cr.is_active = true
        )
    );

CREATE POLICY "OpenActive users can manage all clubs" ON public.clubs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'openactive_user'
        )
    );

-- Club relationships policies
CREATE POLICY "Users can view their own club relationships" ON public.club_relationships
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Club managers can view club relationships" ON public.club_relationships
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.club_relationships cr
            WHERE cr.club_id = club_relationships.club_id 
            AND cr.user_id = auth.uid() 
            AND cr.relationship_type = 'manager'
            AND cr.is_active = true
        )
    );

CREATE POLICY "OpenActive users can manage all relationships" ON public.club_relationships
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'openactive_user'
        )
    );

-- Courts policies
CREATE POLICY "Anyone can view courts of active clubs" ON public.courts
    FOR SELECT USING (
        is_active = true AND 
        EXISTS (
            SELECT 1 FROM public.clubs 
            WHERE id = courts.club_id AND is_active = true
        )
    );

CREATE POLICY "Club managers can manage their courts" ON public.courts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.club_relationships cr
            WHERE cr.club_id = courts.club_id 
            AND cr.user_id = auth.uid() 
            AND cr.relationship_type = 'manager'
            AND cr.is_active = true
        )
    );

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own bookings" ON public.bookings
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bookings" ON public.bookings
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Club managers can view club bookings" ON public.bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.club_relationships cr
            WHERE cr.club_id = bookings.club_id 
            AND cr.user_id = auth.uid() 
            AND cr.relationship_type = 'manager'
            AND cr.is_active = true
        )
    );

-- Events policies
CREATE POLICY "Anyone can view public events" ON public.events
    FOR SELECT USING (is_public = true);

CREATE POLICY "Club members can view club events" ON public.events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.club_relationships cr
            WHERE cr.club_id = events.club_id 
            AND cr.user_id = auth.uid() 
            AND cr.is_active = true
        )
    );

CREATE POLICY "Club managers can manage club events" ON public.events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.club_relationships cr
            WHERE cr.club_id = events.club_id 
            AND cr.user_id = auth.uid() 
            AND cr.relationship_type = 'manager'
            AND cr.is_active = true
        )
    );

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON public.clubs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courts_updated_at BEFORE UPDATE ON public.courts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
