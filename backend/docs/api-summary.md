# TDC Vibecode API Summary

This document provides a comprehensive overview of all available API endpoints in the TDC Vibecode backend.

## Base URL

`http://localhost:4000` (development)

---

## Authentication

The API uses Clerk for authentication. Most endpoints that modify data require authentication via Clerk tokens.

---

## API Routes Overview

### User Routes (`/user`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/user` | No | Get all users (public profiles) |
| GET | `/user/:userId` | No | Get specific user by Clerk ID |
| GET | `/user/me` | Yes | Get current user profile |
| PUT | `/user/me` | Yes | Update profile info |
| POST | `/user/me/skills` | Yes | Add skill to profile |
| PUT | `/user/me/skills/:skillId` | Yes | Update skill rating |
| DELETE | `/user/me/skills/:skillId` | Yes | Remove skill from profile |
| GET | `/user/search` | No | Search users by skills/ratings |

### Job Routes (`/jobs`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/jobs` | No | Get all job postings |
| GET | `/jobs/user/:userId` | No | Get jobs by specific user |
| POST | `/jobs` | Yes | Create new job posting |
| PUT | `/jobs/:jobId` | Yes | Update job (creator only) |
| DELETE | `/jobs/:jobId` | Yes | Delete job (creator only) |

### Endorsement Routes (`/endorsements`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/endorsements` | Yes | Create endorsement |
| GET | `/endorsements/for/:userId` | No | Get endorsements received by user |
| GET | `/endorsements/by/:userId` | No | Get endorsements given by user |
| DELETE | `/endorsements/:endorsementId` | Yes | Delete endorsement (endorser only) |

---

## Search & Filter Capabilities

### User Search (`GET /user/search`)

Filter users by:
- **Skills**: Skill names (case-insensitive, OR logic)
- **Rating Range**: `minRating` and `maxRating` (1-10)
- **Availability**: `availableForHire` boolean

**Example:**
```
GET /user/search?skills=JavaScript,React&minRating=7&availableForHire=true
```

---

## Data Models

### User Profile
- **Public Fields**: `_id`, `name`, `skills`, `availableForHire`, timestamps
- **Private Fields**: `clerkId`, `email`, `contactInfo` (only visible to user themselves)

### Skills
- Each user skill has: `skill` (reference), `rating` (1-10), `endorsements` (array)
- Skills are shared globally but ratings are per-user

### Jobs
- **Required Skills**: Each job specifies skills with minimum rating requirements
- **Access Control**: Only job creator can modify/delete

### Endorsements
- **One-per-skill**: Users can only endorse another user once per skill
- **Bi-directional**: Track both given and received endorsements
- **Self-endorsement**: Prevented by validation

---

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes
- **200**: Success
- **201**: Created successfully
- **400**: Bad request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Resource not found
- **409**: Conflict (duplicate resource)
- **500**: Internal server error

---

## Detailed Documentation

For detailed endpoint documentation, see:
- [User API Documentation](./users.md)
- [Job API Documentation](./jobs.md)
- [Endorsements API Documentation](./endorsements.md)
