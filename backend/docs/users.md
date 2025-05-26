# User API Documentation

## Base Path
`/user`

---

## Authentication
Most routes require authentication via Clerk. The authenticated user's Clerk ID is used to identify the user in the database.

---

## Endpoints

### GET `/user`
Get all users (public profiles only).

**Authentication Required:** No

**Response:**

```json
[
  {
    "_id": "string",
    "name": "string",
    "skills": [
      {
        "skill": {
          "_id": "string",
          "name": "string"
        },
        "rating": "number",
        "endorsements": ["string"]
      }
    ],
    "availableForHire": "boolean",
    "createdAt": "ISODate",
    "updatedAt": "ISODate"
  }
]
```

**Status Codes:**

- 200: Success
- 500: Server error

---

### GET `/user/:userId`
Get a specific user's public profile by their Clerk ID.

**Authentication Required:** No

**URL Parameters:**

- `userId`: Clerk ID of the user to retrieve

**Response:**

```json
{
  "_id": "string",
  "name": "string",
  "skills": [
    {
      "skill": {
        "_id": "string",
        "name": "string"
      },
      "rating": "number",
      "endorsements": [
        {
          "_id": "string",
          "name": "string"
        }
      ]
    }
  ],
  "availableForHire": "boolean",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

**Status Codes:**

- 200: Success
- 404: User not found
- 500: Server error

---

### GET `/user/me`
Get the current user's profile. If the user does not exist, a new user is created from Clerk profile info.

**Authentication Required:** Yes

**Response:**
```
{
  "_id": "string",
  "clerkId": "string",
  "name": "string",
  "email": "string",
  "skills": [
    {
      "skill": "SkillObjectId",
      "rating": number,
      "endorsements": ["UserObjectId"]
    }
  ],
  "availableForHire": boolean,
  "contactInfo": { ... },
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

---

### PUT `/user/me`
Update the current user's profile info.

**Request Body:**
```
{
  "name": "string",
  "availableForHire": boolean,
  "contactInfo": { ... }
}
```
**Response:** Same as GET `/user/me`.

---

### POST `/user/me/skills`
Add a skill to the current user by skill name and rating.

**Request Body:**
```
{
  "skillName": "string",
  "rating": number (1-10)
}
```
**Response:** Same as GET `/user/me`.

---

### PUT `/user/me/skills/:skillId`
Update the rating for a specific skill.

**Request Params:**
- `skillId`: ObjectId of the skill

**Request Body:**
```
{
  "rating": number (1-10)
}
```
**Response:** Same as GET `/user/me`.

---

### DELETE `/user/me/skills/:skillId`
Remove a skill from the current user.

**Request Params:**
- `skillId`: ObjectId of the skill

**Response:** Same as GET `/user/me`.

---

## Notes
- All responses return the full user object after the operation.
- Skill ratings must be between 1 and 10.
- Skills are referenced by ObjectId.
- Endorsements are managed separately.
