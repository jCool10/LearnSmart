import { ValidationSchema } from '@/middlewares/validation.middleware'
import { commonValidations } from '@/middlewares/validation.middleware'

// Auth validation schemas
export const authValidations = {
  // User registration
  register: {
    body: {
      email: {
        ...commonValidations.email,
        required: true
      },
      password: {
        ...commonValidations.password,
        required: true
      },
      username: {
        type: 'string',
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: '^[a-zA-Z0-9_\\s]+$',
        patternMessage: 'Username can only contain letters, numbers, underscores, and spaces'
      }
    }
  } as ValidationSchema,

  // User login
  login: {
    body: {
      email: {
        type: 'email',
        required: true
      },
      password: {
        type: 'string',
        required: true,
        minLength: 1 // Just check it's not empty, actual validation happens in service
      }
    }
  } as ValidationSchema,

  // Refresh tokens
  refreshTokens: {
    body: {
      refreshToken: {
        type: 'string',
        required: true,
        minLength: 10 // JWT tokens are much longer, but basic check
      }
    }
  } as ValidationSchema,

  // Logout
  logout: {
    body: {
      refreshToken: {
        type: 'string',
        required: true,
        minLength: 10
      }
    }
  } as ValidationSchema,

  // Forgot password
  forgotPassword: {
    body: {
      email: {
        type: 'email',
        required: true
      }
    }
  } as ValidationSchema,

  // Reset password
  resetPassword: {
    body: {
      resetPasswordToken: {
        type: 'string',
        required: true,
        minLength: 10
      },
      newPassword: {
        ...commonValidations.password,
        required: true
      }
    }
  } as ValidationSchema,

  // Verify email
  verifyEmail: {
    body: {
      verifyEmailToken: {
        type: 'string',
        required: true,
        minLength: 10
      }
    }
  } as ValidationSchema,

  // Send verification email (requires authenticated user)
  sendVerificationEmail: {
    // No body validation needed as it uses authenticated user
  } as ValidationSchema
}

// User management validation schemas
export const userValidations = {
  // Create user
  createUser: {
    body: {
      name: {
        type: 'string',
        required: true,
        minLength: 2,
        maxLength: 50
      },
      email: {
        ...commonValidations.email,
        required: true
      },
      password: {
        ...commonValidations.password,
        required: true
      },
      role: {
        type: 'string',
        enum: ['user', 'admin'],
        required: false
      }
    }
  } as ValidationSchema,

  // Update user
  updateUser: {
    params: {
      id: {
        ...commonValidations.cuid,
        required: true
      }
    },
    body: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 50,
        required: false
      },
      email: {
        type: 'email',
        required: false
      },
      password: {
        ...commonValidations.password,
        required: false
      },
      role: {
        type: 'string',
        enum: ['user', 'admin'],
        required: false
      },
      isEmailVerified: {
        type: 'boolean',
        required: false
      }
    }
  } as ValidationSchema,

  // Get user by ID
  getUserById: {
    params: {
      id: {
        ...commonValidations.cuid,
        required: true
      }
    }
  } as ValidationSchema,

  // Get user by email
  getUserByEmail: {
    params: {
      email: {
        type: 'email',
        required: true
      }
    }
  } as ValidationSchema,

  // Get all users with pagination
  getAllUsers: {
    query: {
      page: {
        type: 'number',
        min: 1,
        required: false
      },
      limit: {
        type: 'number',
        min: 1,
        max: 100,
        required: false
      },
      role: {
        type: 'string',
        enum: ['user', 'admin'],
        required: false
      },
      isEmailVerified: {
        type: 'boolean',
        required: false
      }
    }
  } as ValidationSchema,

  // Search users
  searchUsers: {
    query: {
      q: {
        type: 'string',
        required: true,
        minLength: 1,
        maxLength: 100
      },
      page: {
        type: 'number',
        min: 1,
        required: false
      },
      limit: {
        type: 'number',
        min: 1,
        max: 100,
        required: false
      }
    }
  } as ValidationSchema,

  // Delete user
  deleteUser: {
    params: {
      id: {
        ...commonValidations.cuid,
        required: true
      }
    }
  } as ValidationSchema,

  // Get user roadmaps
  getUserRoadmaps: {
    params: {
      id: {
        ...commonValidations.cuid,
        required: true
      }
    },
    query: {
      status: {
        type: 'string',
        enum: ['enrolled', 'completed', 'all'],
        required: false
      },
      page: {
        type: 'number',
        min: 1,
        required: false
      },
      limit: {
        type: 'number',
        min: 1,
        max: 100,
        required: false
      }
    }
  } as ValidationSchema
}

// Token management validation schemas
export const tokenValidations = {
  // Create token
  createToken: {
    body: {
      token: {
        type: 'string',
        required: true,
        minLength: 10
      },
      userId: {
        ...commonValidations.cuid,
        required: true
      },
      type: {
        type: 'string',
        enum: ['refresh', 'resetPassword', 'verifyEmail'],
        required: true
      },
      expires: {
        type: 'string', // ISO date string
        required: true,
        pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}',
        patternMessage: 'Must be a valid ISO date string'
      },
      blacklisted: {
        type: 'boolean',
        required: false
      }
    }
  } as ValidationSchema,

  // Get token by ID
  getTokenById: {
    params: {
      id: {
        ...commonValidations.cuid,
        required: true
      }
    }
  } as ValidationSchema,

  // Update token
  updateToken: {
    params: {
      id: {
        ...commonValidations.cuid,
        required: true
      }
    },
    body: {
      token: {
        type: 'string',
        minLength: 10,
        required: false
      },
      expires: {
        type: 'string',
        pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}',
        patternMessage: 'Must be a valid ISO date string',
        required: false
      },
      blacklisted: {
        type: 'boolean',
        required: false
      }
    }
  } as ValidationSchema,

  // Delete token
  deleteToken: {
    params: {
      id: {
        ...commonValidations.cuid,
        required: true
      }
    }
  } as ValidationSchema,

  // Get tokens with pagination
  getAllTokens: {
    query: {
      page: {
        type: 'number',
        min: 1,
        required: false
      },
      limit: {
        type: 'number',
        min: 1,
        max: 100,
        required: false
      },
      type: {
        type: 'string',
        enum: ['refresh', 'resetPassword', 'verifyEmail'],
        required: false
      },
      blacklisted: {
        type: 'boolean',
        required: false
      },
      userId: {
        ...commonValidations.cuid,
        required: false
      }
    }
  } as ValidationSchema
}

export default {
  auth: authValidations,
  user: userValidations,
  token: tokenValidations
}
