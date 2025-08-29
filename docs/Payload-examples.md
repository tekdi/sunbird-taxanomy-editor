# C4GT Taxonomy Management API Calls (with Payloads)

This document outlines the step-wise API calls for taxonomy management in **C4GT Framework Creation**, including payloads and request/response structures.

---

## Step 1: Channel Management

### 1.1 Create Channel

**POST** `/channel/v3/create`

```json
{
  "request": {
    "channel": {
      "name": "C4gt Test Channel",
      "code": "c4gtTestChannel"
    }
  }
}
```

✅ Response:

```json
{
  "id": "api.channel.create",
  "ver": "3.0",
  "responseCode": "OK",
  "result": {
    "identifier": "c4gtTestChannel",
    "node_id": "c4gtTestChannel"
  }
}
```

---

### 1.2 Read Channel

**GET** `/channel/v3/read/c4gtTestChannel`

Response: `200 OK`

---

### 1.3 Update Channel

**PATCH** `/channel/v3/update/c4gtTestChannel`

```json
{
  "request": {
    "channel": {
      "description": "This is test channel for c4gt"
    }
  }
}
```

---

## Step 2: Framework Management

### 2.1 Create Framework

**POST** `/framework/v3/create`
Headers: `X-Channel-Id: c4gtTestChannel`, `Content-Type: application/json`

```json
{
  "request": {
    "framework": {
      "name": "Vidya Framework",
      "code": "vidyaFramework",
      "description": "Framework for testing UI flow for taxonomy management",
      "type": "K-12",
      "channel": "c4gtTestChannel"
    }
  }
}
```

---

### 2.2 Read Framework

**GET** `/framework/v3/read/vidyaFramework`
Response: `200 OK`

---

### 2.3 Update Framework

**PATCH** `/framework/v3/update/vidyaFramework`

```json
{
  "request": {
    "framework": {
      "description": "This is Framework for testing and UI implementation for C4GT"
    }
  }
}
```

---

## Step 3: Master Category Management

### 3.1 Create Master Category (Example: Board)

**POST** `/framework/v3/category/master/create`

```json
{
  "request": {
    "category": {
      "name": "Board",
      "description": "Board",
      "code": "board",
      "targetIdFieldName": "targetBoardIds",
      "searchLabelFieldName": "se_boards",
      "searchIdFieldName": "se_boardIds",
      "orgIdFieldName": "boardIds"
    }
  }
}
```

(Similar payloads for **State**, **Medium**, **GradeLevel**, **Subject** — only `name`, `code`, and field names differ.)

---

## Step 4: Framework Category Management

### 4.1 Create Framework Category (Example: Subject)

**POST** `/framework/v3/category/create?framework=vidyaFramework`

```json
{
  "request": {
    "category": {
      "name": "Subject",
      "code": "subject",
      "description": "Subject category"
    }
  }
}
```

---

### 4.2 Read Framework Category

**GET** `/framework/v3/category/read/{categoryCode}?framework=vidyaFramework`

Response returns framework details with all categories.

---

### 4.3 Update Framework Category

**PATCH** `/framework/v3/category/update/board?framework=vidyaFramework`

```json
{
  "request": {
    "category": {
      "description": "Board category"
    }
  }
}
```

---

## Step 5: Term Management

### 5.1 Create Term (Example: Board – CBSE)

**POST** `/framework/v3/term/create?framework=vidyaFramework&category=board`

```json
{
  "request": {
    "term": {
      "name": "CBSE",
      "label": "CBSE",
      "description": "CBSE Board",
      "code": "cbse"
    }
  }
}
```

(Repeat for **Medium**, **GradeLevel**, **Subject** — only field values change.)

---

### 5.2 Update Term (Associations)

#### Understanding Taxonomy Hierarchy

The taxonomy follows a strict hierarchical structure where associations must be created from top to bottom levels:

**Hierarchy Order:**

1. **Board** (Top level) → Associates to Medium, Grade Level, and Subject
2. **Medium** → Associates to Grade Level and Subject
3. **Grade Level** → Associates to Subject
4. **Subject** (Bottom level) → No associations needed

#### Association Examples by Hierarchy Level

**Board Level - CBSE (Associates to all lower levels):**

**PATCH** `/framework/v3/term/update/cbse?framework=vidyaFramework&category=board`

```json
{
  "request": {
    "term": {
      "associations": [
        { "identifier": "vidyaFramework_medium_english" },
        { "identifier": "vidyaFramework_medium_hindi" },
        { "identifier": "vidyaFramework_gradeLevel_class10" },
        { "identifier": "vidyaFramework_gradeLevel_class12" },
        { "identifier": "vidyaFramework_subject_mathematics" },
        { "identifier": "vidyaFramework_subject_science" },
        { "identifier": "vidyaFramework_subject_history" }
      ]
    }
  }
}
```

**Medium Level - English (Associates to Grade Level and Subject):**

**PATCH** `/framework/v3/term/update/english?framework=vidyaFramework&category=medium`

```json
{
  "request": {
    "term": {
      "associations": [
        { "identifier": "vidyaFramework_gradeLevel_class10" },
        { "identifier": "vidyaFramework_gradeLevel_class12" },
        { "identifier": "vidyaFramework_subject_mathematics" },
        { "identifier": "vidyaFramework_subject_science" },
        { "identifier": "vidyaFramework_subject_history" }
      ]
    }
  }
}
```

**Grade Level - Class 10 (Associates to Subject only):**

**PATCH** `/framework/v3/term/update/class10?framework=vidyaFramework&category=gradeLevel`

```json
{
  "request": {
    "term": {
      "associations": [
        { "identifier": "vidyaFramework_subject_mathematics" },
        { "identifier": "vidyaFramework_subject_science" },
        { "identifier": "vidyaFramework_subject_history" }
      ]
    }
  }
}
```

**Subject Level - Mathematics (Bottom level, no associations)**

**Important Notes:**

- Always create associations from higher hierarchy levels to lower levels
- Each term associates to all relevant terms in categories below it in the hierarchy
- Subject terms (bottom level) typically don't need associations
- This hierarchy ensures proper content filtering and discovery in the system

---

## Step 6: Framework Publish

### 6.1 Publish Framework

**POST** `/framework/v3/publish/vidyaFramework`

Headers:

- `X-Channel-Id: c4gtTestChannel`
- `Content-Type: application/json`

✅ Response:

```json
{
  "id": "api.taxonomy.framework.publish",
  "ver": "3.0",
  "responseCode": "OK",
  "result": {
    "publishStatus": "Publish Event for Framework Id 'vidyaFramework' is pushed Successfully!"
  }
}
```
