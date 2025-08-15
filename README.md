# ValidToT - User Authentication System

## Overview

This document describes the implementation of the user authentication system for ValidToT, which solves the shared IP issue while maintaining the option for anonymous posting.

## Problem Statement

The original implementation used IP address tracking to prevent multiple votes on the same "tot" (poll). This created a problem when multiple people shared the same network (office, home, etc.), as they had the same public IP address. The system treated them as a single user, preventing legitimate votes from co-workers or family members.

## Solution

We implemented a comprehensive user authentication system that:

1. Allows users to create accounts with email/password authentication
2. Associates votes with user accounts rather than IP addresses
3. Maintains backward compatibility with anonymous users
4. Provides an option for users to post anonymously while still having an account

## Database Changes

### New Tables

1. **users** table:
   - `id` (UUID) - Primary key
   - `username` (string, unique) - Display name
   - `email` (string, unique) - For login purposes
   - `password_hash` (string) - Securely hashed password
   - `is_anonymous` (boolean) - Flag for anonymous posting
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

2. **sessions** table:
   - `id` (UUID) - Session identifier
   - `user_id` (foreign key to users.id)
   - `token` (string, unique) - Session token
   - `expires_at` (timestamp)
   - `created_at` (timestamp)

### Modified Tables

1. **tots** table:
   - Added `creator_user_id` (foreign key to users.id) - References the user who created the tot
   - Added `is_anonymous` (boolean) - Flag for anonymous posting

2. **votes** table:
   - Added `user_id` (foreign key to users.id) - References the user who voted
   - Modified constraint to be unique per (tot_id, user_id) instead of (tot_id, voter_ip)

## API Endpoints

### Authentication Endpoints

1. **POST /auth/register** - User registration
   - Parameters: username, email, password
   - Response: user object with session token

2. **POST /auth/login** - User login
   - Parameters: email, password
   - Response: user object with session token

3. **POST /auth/logout** - User logout
   - Parameters: session token
   - Response: success message

4. **GET /auth/me** - Get current user info
   - Parameters: session token
   - Response: user object

### Modified Voting Endpoints

1. **POST /tots/:id/vote** - Updated to use user authentication
   - Check if user is logged in via session token
   - Associate vote with user_id instead of IP
   - Maintain backward compatibility for anonymous users

2. **GET /tots/:id/vote-status** - Updated to check by user
   - Check if current user has voted on this tot

## Frontend Implementation

### Authentication Components

1. **Login/Registration Forms** - Simple, clean UI for user onboarding
2. **User Profile Panel** - Display user info and settings
3. **Anonymous Toggle** - Switch to control anonymous posting

### Session Management

1. **Session Storage** - Store session token in localStorage
2. **Auto-login** - Re-authenticate users on page refresh
3. **Session Expiry Handling** - Redirect to login when session expires

## Anonymous Posting Feature

Users can toggle anonymous mode which:
1. Hides their username when creating tots
2. Shows "Anonymous User" instead of username on votes
3. Maintains vote privacy while still preventing multiple votes per user

## Migration Plan

### Phase 1: Database Migration
1. Create new users and sessions tables
2. Add user_id columns to existing tables
3. Create migration script to associate existing data with anonymous users

### Phase 2: API Implementation
1. Implement authentication endpoints
2. Update existing endpoints to support authenticated users
3. Maintain backward compatibility for anonymous users

### Phase 3: Frontend Implementation
1. Add authentication UI components
2. Implement session management
3. Update voting interface to work with authenticated users

### Phase 4: Testing and Deployment
1. Comprehensive testing of authentication flows
2. Test migration with sample data
3. Deploy to staging environment for review
4. Gradual rollout to production

## Security Considerations

1. **Password Security** - Use bcrypt for password hashing
2. **Session Management** - Secure, expiring tokens
3. **Rate Limiting** - Prevent brute force attacks
4. **Input Validation** - Sanitize all user inputs
5. **Anonymous User Protection** - Prevent abuse of anonymous features

## Benefits

1. **Solves Shared IP Issue** - Users on same network can vote independently
2. **Maintains Anonymity Option** - Users can choose anonymous posting
3. **Enhanced Features** - User profiles, vote history, etc.
4. **Scalable Solution** - Can support future growth and features
5. **Backward Compatible** - Existing anonymous users continue to work

## Future Enhancements

1. **Social Features** - Friends lists, following users
2. **Advanced Privacy Controls** - Granular control over what information is shared
3. **Multi-factor Authentication** - Enhanced security for user accounts
4. **OAuth Integration** - Login with Google, Facebook, etc.