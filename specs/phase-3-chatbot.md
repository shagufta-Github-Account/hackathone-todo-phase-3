# Phase 3 - AI-Powered Todo Chatbot Specifications

## Overview
This document outlines the specifications for an AI-powered Todo Chatbot that integrates with the existing Phase 2 Full-Stack Todo App. The chatbot will provide a conversational interface for managing tasks using natural language processing and MCP tools.

## Requirements
- Build an AI-powered Todo Chatbot using MCP tools and OpenAI Agents
- Do NOT modify Phase 2 APIs, DB schema, auth, or UI
- AI must NOT directly access database
- AI can only act via MCP tools
- Stateless backend
- Clear, minimal scope

## Chatbot Behavior
The chatbot should understand and respond to natural language inputs related to todo management. It should support both direct commands and conversational language:

- **Natural Language Processing**: Interpret user intents from casual conversation
- **Command Recognition**: Identify specific commands for task operations
- **Context Awareness**: Maintain context within a conversation session
- **Help System**: Provide assistance when users need guidance
- **Error Recovery**: Handle misunderstandings gracefully and ask for clarification

### Example User Interactions:
- "Add a task to buy groceries for tomorrow"
- "Show me all incomplete tasks"
- "Mark the first task as complete"
- "Update the deadline for 'finish report' to Friday"
- "Delete the meeting preparation task"

## Supported Commands

### Task Creation
- `add task [description]`
- `create task [description]`
- `new task [description]`
- Natural language equivalents: "I need to remember to...", "Don't forget to..."

### Task Listing
- `list tasks`
- `show tasks`
- `view tasks`
- `list completed tasks`
- `list incomplete tasks`
- Natural language equivalents: "What do I need to do?", "Show me my tasks"

### Task Updates
- `update task [id] [new description]`
- `edit task [id] [new description]`
- Natural language equivalents: "Change the task 'buy milk' to 'buy almond milk'"

### Task Completion
- `complete task [id]`
- `mark task [id] complete`
- `finish task [id]`
- Natural language equivalents: "I finished the report", "Mark task 1 as done"

### Task Deletion
- `delete task [id]`
- `remove task [id]`
- Natural language equivalents: "Remove the appointment task"

## MCP Tools Specification

### 1. Create Task Tool
**Tool Name**: `createTask`
**Description**: Creates a new task in the system
**Input Contract**:
```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Title of the task"
    },
    "description": {
      "type": "string",
      "description": "Detailed description of the task"
    },
    "dueDate": {
      "type": "string",
      "format": "date-time",
      "description": "Due date for the task in ISO format"
    },
    "priority": {
      "type": "string",
      "enum": ["low", "medium", "high"],
      "description": "Priority level of the task"
    }
  },
  "required": ["title"]
}
```
**Output Contract**:
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "description": "Whether the operation was successful"
    },
    "taskId": {
      "type": "string",
      "description": "ID of the created task"
    },
    "message": {
      "type": "string",
      "description": "Result message"
    }
  }
}
```

### 2. List Tasks Tool
**Tool Name**: `listTasks`
**Description**: Retrieves tasks from the system based on filters
**Input Contract**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "enum": ["all", "completed", "incomplete"],
      "description": "Filter tasks by completion status"
    },
    "limit": {
      "type": "number",
      "description": "Maximum number of tasks to return"
    },
    "sortBy": {
      "type": "string",
      "enum": ["createdAt", "dueDate", "priority"],
      "description": "Sort order for tasks"
    }
  }
}
```
**Output Contract**:
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "description": "Whether the operation was successful"
    },
    "tasks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Task ID"
          },
          "title": {
            "type": "string",
            "description": "Task title"
          },
          "description": {
            "type": "string",
            "description": "Task description"
          },
          "completed": {
            "type": "boolean",
            "description": "Whether task is completed"
          },
          "dueDate": {
            "type": "string",
            "format": "date-time",
            "description": "Task due date"
          },
          "priority": {
            "type": "string",
            "enum": ["low", "medium", "high"],
            "description": "Task priority"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "description": "Task creation timestamp"
          }
        }
      }
    },
    "message": {
      "type": "string",
      "description": "Result message"
    }
  }
}
```

### 3. Update Task Tool
**Tool Name**: `updateTask`
**Description**: Updates an existing task in the system
**Input Contract**:
```json
{
  "type": "object",
  "properties": {
    "taskId": {
      "type": "string",
      "description": "ID of the task to update"
    },
    "title": {
      "type": "string",
      "description": "New title for the task"
    },
    "description": {
      "type": "string",
      "description": "New description for the task"
    },
    "dueDate": {
      "type": "string",
      "format": "date-time",
      "description": "New due date for the task"
    },
    "priority": {
      "type": "string",
      "enum": ["low", "medium", "high"],
      "description": "New priority for the task"
    },
    "completed": {
      "type": "boolean",
      "description": "New completion status for the task"
    }
  },
  "required": ["taskId"]
}
```
**Output Contract**:
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "description": "Whether the operation was successful"
    },
    "taskId": {
      "type": "string",
      "description": "ID of the updated task"
    },
    "message": {
      "type": "string",
      "description": "Result message"
    }
  }
}
```

### 4. Delete Task Tool
**Tool Name**: `deleteTask`
**Description**: Deletes a task from the system
**Input Contract**:
```json
{
  "type": "object",
  "properties": {
    "taskId": {
      "type": "string",
      "description": "ID of the task to delete"
    }
  },
  "required": ["taskId"]
}
```
**Output Contract**:
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "description": "Whether the operation was successful"
    },
    "taskId": {
      "type": "string",
      "description": "ID of the deleted task"
    },
    "message": {
      "type": "string",
      "description": "Result message"
    }
  }
}
```

### 5. Get Task Details Tool
**Tool Name**: `getTaskDetails`
**Description**: Retrieves detailed information about a specific task
**Input Contract**:
```json
{
  "type": "object",
  "properties": {
    "taskId": {
      "type": "string",
      "description": "ID of the task to retrieve"
    }
  },
  "required": ["taskId"]
}
```
**Output Contract**:
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "description": "Whether the operation was successful"
    },
    "task": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "description": "Task ID"
        },
        "title": {
          "type": "string",
          "description": "Task title"
        },
        "description": {
          "type": "string",
          "description": "Task description"
        },
        "completed": {
          "type": "boolean",
          "description": "Whether task is completed"
        },
        "dueDate": {
          "type": "string",
          "format": "date-time",
          "description": "Task due date"
        },
        "priority": {
          "type": "string",
          "enum": ["low", "medium", "high"],
          "description": "Task priority"
        },
        "createdAt": {
          "type": "string",
          "format": "date-time",
          "description": "Task creation timestamp"
        }
      }
    },
    "message": {
      "type": "string",
      "description": "Result message"
    }
  }
}
```

## API Contract for POST /api/chat

### Endpoint: POST /api/chat
**Description**: Main endpoint for the chatbot API that processes user input and returns AI-generated responses with tool calls.

**Request Format**:
```json
{
  "type": "object",
  "properties": {
    "userId": {
      "type": "string",
      "description": "Authenticated user ID"
    },
    "message": {
      "type": "string",
      "description": "User's input message"
    },
    "sessionId": {
      "type": "string",
      "description": "Conversation session ID to maintain context"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp of the message"
    }
  },
  "required": ["userId", "message"]
}
```

**Response Format**:
```json
{
  "type": "object",
  "properties": {
    "response": {
      "type": "string",
      "description": "AI-generated response message"
    },
    "toolCalls": {
      "type": "array",
      "description": "Array of tools to execute",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "Name of the tool to call"
          },
          "arguments": {
            "type": "object",
            "description": "Arguments for the tool call"
          }
        }
      }
    },
    "sessionId": {
      "type": "string",
      "description": "Session ID for maintaining conversation context"
    },
    "success": {
      "type": "boolean",
      "description": "Whether the request was processed successfully"
    },
    "error": {
      "type": "string",
      "description": "Error message if request failed"
    }
  }
}
```

### Authentication
- Use the same authentication mechanism as the existing Phase 2 API
- Validate user session before processing requests
- Include user context in all tool calls

### Rate Limiting
- Implement rate limiting to prevent abuse
- Limit to 10 requests per minute per user

## Error Handling Expectations

### Client-Side Errors
- Invalid user input (malformed JSON, missing required fields)
- Unauthorized access attempts
- Rate limiting exceeded

### Server-Side Errors
- Tool execution failures
- Database connection issues (handled by MCP tools)
- External service failures

### AI Processing Errors
- Natural language processing failures
- Ambiguous user intent
- Tool parameter extraction errors

### Error Response Format
```json
{
  "success": false,
  "error": "Descriptive error message",
  "errorCode": "ERROR_CODE_STRING",
  "details": {
    "timestamp": "ISO date-time string",
    "requestId": "Unique identifier for the request"
  }
}
```

### Specific Error Codes
- `INVALID_INPUT`: Request contains invalid or malformed data
- `UNAUTHORIZED`: User authentication failed
- `RATE_LIMIT_EXCEEDED`: Too many requests from user
- `TOOL_EXECUTION_FAILED`: MCP tool execution failed
- `AI_PROCESSING_ERROR`: AI model processing failed
- `TASK_NOT_FOUND`: Requested task does not exist
- `INSUFFICIENT_CONTEXT`: AI needs more information to process request

## Acceptance Criteria

- [ ] Chatbot understands and processes natural language input for all supported commands
- [ ] MCP tools properly integrate with the existing Phase 2 API
- [ ] AI agent can only interact with the system through defined MCP tools
- [ ] Database is never accessed directly by the AI
- [ ] Backend remains stateless (no session storage on server)
- [ ] Proper authentication and authorization implemented
- [ ] Error handling covers all edge cases and provides helpful messages
- [ ] API follows the specified contract with consistent response formats
- [ ] Rate limiting prevents abuse of the system
- [ ] Conversation context is maintained appropriately during sessions
- [ ] All task operations (CRUD) work correctly through the chat interface
- [ ] Tool input/output contracts are validated and enforced
- [ ] Performance meets acceptable response time thresholds (<2 seconds)
- [ ] Security scanning passes without high-severity vulnerabilities
- [ ] Integration tests validate the complete flow from user input to task operations