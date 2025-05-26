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

```json
{
  "_id": "string",
  "clerkId": "string",
  "name": "string",
  "email": "string",
  "skills": [
    {
      "skill": "SkillObjectId",
      "rating": "number",
      "endorsements": ["UserObjectId"]
    }
  ],
  "availableForHire": "boolean",
  "contactInfo": { 
    "email": "string",
    "phone": "string"
  },
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

---

### PUT `/user/me`

Update the current user's profile info.

**Authentication Required:** Yes

**Request Body:**

```json
{
  "name": "string",
  "availableForHire": "boolean",
  "contactInfo": { 
    "email": "string",
    "phone": "string"
  }
}
```

**Response:** Same as GET `/user/me`.

---

### POST `/user/me/skills`

Add a skill to the current user by skill name and rating.

**Authentication Required:** Yes

**Request Body:**

```json
{
  "skillName": "string",
  "rating": "number" // (1-10)
}
```

**Response:** Same as GET `/user/me`.

---

### PUT `/user/me/skills/:skillId`

Update the rating for a specific skill.

**Authentication Required:** Yes

**Request Params:**

- `skillId`: ObjectId of the skill

**Request Body:**

```json
{
  "rating": "number" // (1-10)
}
```

**Response:** Same as GET `/user/me`.

---

### DELETE `/user/me/skills/:skillId`

Remove a skill from the current user.

**Authentication Required:** Yes

**Request Params:**

- `skillId`: ObjectId of the skill

**Response:** Same as GET `/user/me`.

---

---

### GET `/user/search`

Search for users based on their skills and rating ranges.

**Authentication Required:** No

**Query Parameters:**

- `skills` (optional): String or array of skill names to search for (case-insensitive)
- `minRating` (optional): Minimum skill rating (1-10)
- `maxRating` (optional): Maximum skill rating (1-10)
- `availableForHire` (optional): Boolean string ("true" or "false") to filter by availability

**Example Requests:**

- `/user/search?skills=JavaScript&minRating=7` - Find users with JavaScript skill rated 7 or higher
- `/user/search?skills=JavaScript,React&minRating=5&maxRating=9` - Find users with JavaScript OR React skills between 5-9 rating
- `/user/search?availableForHire=true` - Find users available for hire

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

- 200: Success (returns empty array if no matches found)
- 500: Server error

---

## Notes
- All responses return the full user object after the operation.
- Skill ratings must be between 1 and 10.
- Skills are referenced by ObjectId.
- Endorsements are managed separately.
