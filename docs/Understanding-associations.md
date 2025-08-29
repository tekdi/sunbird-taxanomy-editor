# Understanding Associations in Sunbird Framework

This document explains how term associations work in Sunbird's framework module and how to implement them using the Term Update API.

## Overview

Associating two terms in Sunbird's framework module involves updating one term to include a list of other terms it should be associated with using the `associationswith` and `associations` attributes via the Term Update API.

## Association Types

From the payload available at sunbird-ed-installer, there are two types of associations:

### 1. associationswith

```json
{
  "relationName": "associatedTo",
  "objectTypes": ["Term"],
  "title": "associationswith",
  "description": "Terms from which the current term is associated"
}
```

**Description**: This term is associated "from" other terms.

**Direction**: The connection starts from the term that is/will be mentioned in the payload and points to the one present in the URL.

### 2. associations

```json
{
  "relationName": "associatedTo",
  "objectTypes": ["Term"],
  "title": "associations",
  "description": "Terms associated with the current term"
}
```

**Description**: This term is associated "to" other terms.

**Direction**: This is a mirror to `associationswith`, but this time the current term is the source of the association.

## Relationship Diagram

```
Term A
 ├── associations ➝ Term D, E     (A is associated to D and E)
 └── associationswith ← Term F, G  (F and G are associated to A)
```

## Implementation Examples

### JavaScript API Request Example

**Scenario**: Term B is now associated to Term A

```
Term A
 └── associationswith ← Term B     (Term B is now associated to Term A)
```

**Code Implementation**:

```javascript
const termAId = '<termA-id>';
const termBId = '<termB-id>';
const framework = 'yourFramework';
const category = 'yourCategory';
const apiKey = '<API Key>';

fetch(
  `https://staging.open-sunbird.org/api/framework/v1/term/update/${termAId}?framework=${framework}&category=${category}`,
  {
    method: 'PATCH',
    headers: {
      Authorization: apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      request: {
        term: {
          associationswith: [{ identifier: termBId }],
        },
      },
    }),
  }
)
  .then((response) => response.json())
  .then((data) => console.log('Success:', data))
  .catch((error) => console.error('Error:', error));
```

## Practical Example

**Objective**: Associate the "Learning for Work" domain term with the following:

- Career Exploration (SubDomain)
- New Age Skills (SubDomain)
- Automotive (Stream)

**API Endpoint**:

```
PATCH /api/framework/v1/term/update/youthnet-framework_domain_learningforwork?framework=youthnet-framework&category=domain
```

**Payload**:

```javascript
const payload = {
  request: {
    term: {
      associations: [
        { identifier: 'youthnet-framework_subdomain_careerexploration' },
        { identifier: 'youthnet-framework_subdomain_newageskills' },
        { identifier: 'youthnet-framework_stream_automotive' },
      ],
    },
  },
};
```

## Important Considerations

### Key Requirements:

1. **Identifier Management**: We need to fetch and store the "identifier" for each term before making the PATCH request
2. **Bidirectional Associations**: "associations" is not bidirectional. In order to facilitate a bidirectional association, we have to use both "associations" and "associationswith"

### Best Practices:

- Always validate term identifiers before creating associations
- Consider the direction of associations when designing your taxonomy structure
