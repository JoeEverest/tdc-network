# Job API Documentation

## Base Path
`/jobs`

---

## Authentication
Most routes require authentication via Clerk. The authenticated user's Clerk ID is used to identify the user in the database.

---

## Endpoints

### POST `/jobs`
Create a new job posting.

**Authentication Required:** Yes

**Request Body:**
```
{
  "title": "string",
  "description": "string",
  "requiredSkills": [
    {
      "skillId": "ObjectId",
      "minRating": number (1-10)
    }
  ]
}
```

**Response:**
```
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "requiredSkills": [
    {
      "skill": "ObjectId",
      "minRating": number
    }
  ],
  "postedBy": "ObjectId",
  "applicants": [],
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

**Status Codes:**
- 201: Job created successfully
- 400: Invalid request (missing fields or invalid format)
- 404: User not found
- 500: Server error

---

### PUT `/jobs/:jobId`
Update an existing job posting.

**Authentication Required:** Yes (must be the job creator)

**URL Parameters:**
- `jobId`: MongoDB ObjectId of the job to update

**Request Body:**
```
{
  "title": "string", // Optional
  "description": "string", // Optional
  "requiredSkills": [ // Optional
    {
      "skillId": "ObjectId",
      "minRating": number (1-10)
    }
  ]
}
```

**Response:**
```
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "requiredSkills": [
    {
      "skill": "ObjectId",
      "minRating": number
    }
  ],
  "postedBy": "ObjectId",
  "applicants": ["ObjectId"],
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

**Status Codes:**
- 200: Job updated successfully
- 400: Invalid request format
- 403: Not authorized to update this job
- 404: Job not found
- 500: Server error

---

### DELETE `/jobs/:jobId`
Delete a job posting.

**Authentication Required:** Yes (must be the job creator)

**URL Parameters:**
- `jobId`: MongoDB ObjectId of the job to delete

**Response:**
```
{
  "message": "Job deleted successfully"
}
```

**Status Codes:**
- 200: Job deleted successfully
- 403: Not authorized to delete this job
- 404: Job not found
- 500: Server error

---

### GET `/jobs`
Get all jobs.

**Authentication Required:** No

**Response:**
```
[
  {
    "_id": "ObjectId",
    "title": "string",
    "description": "string",
    "requiredSkills": [
      {
        "skill": {
          "_id": "ObjectId",
          "name": "string"
        },
        "minRating": number
      }
    ],
    "postedBy": {
      "_id": "ObjectId",
      "name": "string"
    },
    "applicants": ["ObjectId"],
    "createdAt": "ISODate",
    "updatedAt": "ISODate"
  }
]
```

**Status Codes:**
- 200: Success
- 500: Server error

---

### GET `/jobs/user/:userId`
Get all jobs posted by a specific user.

**Authentication Required:** No

**URL Parameters:**
- `userId`: Clerk ID of the user whose jobs to retrieve

**Response:**
```
[
  {
    "_id": "ObjectId",
    "title": "string",
    "description": "string",
    "requiredSkills": [
      {
        "skill": {
          "_id": "ObjectId",
          "name": "string"
        },
        "minRating": number
      }
    ],
    "postedBy": "ObjectId",
    "applicants": ["ObjectId"],
    "createdAt": "ISODate",
    "updatedAt": "ISODate"
  }
]
```

**Status Codes:**
- 200: Success
- 404: User not found
- 500: Server error

---

## Notes
- Only the user who created a job can update or delete it
- All jobs can be viewed by any user
- Required skills specify both the skill and the minimum rating required
