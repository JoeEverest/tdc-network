# Endorsements API Documentation

## Base Path
`/endorsements`

---

## Authentication
Most routes require authentication via Clerk. The authenticated user's Clerk ID is used to identify the user in the database.

---

## Endpoints

### POST `/endorsements`
Create a new endorsement for another user's skill.

**Authentication Required:** Yes

**Request Body:**
```
{
  "endorsedUserId": "string", // Clerk ID of user being endorsed
  "skillId": "string" // MongoDB ObjectId of the skill
}
```

**Response:**
```
{
  "_id": "string",
  "skill": "ObjectId",
  "endorsedUser": "ObjectId",
  "endorsedBy": "ObjectId", // MongoDB ObjectId of the endorsing user
  "createdAt": "ISODate"
}
```

**Status Codes:**
- 201: Endorsement created successfully
- 400: Missing required fields or cannot endorse yourself
- 404: User or skill not found
- 409: Already endorsed this user for this skill
- 500: Server error

---

### GET `/endorsements/for/:userId`
Get all endorsements received by a specific user.

**Authentication Required:** No

**URL Parameters:**
- `userId`: Clerk ID of the user whose endorsements to retrieve

**Response:**
```
[
  {
    "_id": "string",
    "skill": {
      "_id": "string",
      "name": "string" 
    },
    "endorsedUser": {
      "_id": "string",
      "name": "string"
    },
    "endorsedBy": {
      "_id": "string",
      "name": "string"
    },
    "createdAt": "ISODate"
  }
]
```

**Status Codes:**
- 200: Success
- 404: User not found
- 500: Server error

---

### GET `/endorsements/by/:userId`
Get all endorsements given by a specific user.

**Authentication Required:** No

**URL Parameters:**
- `userId`: Clerk ID of the user whose given endorsements to retrieve

**Response:**
Same format as GET `/endorsements/for/:userId`

**Status Codes:**
- 200: Success
- 404: User not found
- 500: Server error

---

### DELETE `/endorsements/:endorsementId`
Delete an endorsement. Only the user who gave the endorsement can delete it.

**Authentication Required:** Yes

**URL Parameters:**
- `endorsementId`: MongoDB ObjectId of the endorsement to delete

**Response:**
```
{
  "message": "Endorsement deleted successfully"
}
```

**Status Codes:**
- 200: Success
- 403: Not authorized to delete this endorsement
- 404: Endorsement not found
- 500: Server error

---

## Notes
- Users cannot endorse themselves
- Users can only endorse skills that exist in the endorsed user's profile
- A user can only endorse another user once per skill
- Only the endorser can delete their own endorsement
