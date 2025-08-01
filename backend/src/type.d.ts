declare global {
  namespace Express {
    interface Request {
      requestId?: string
      slowOperationLogged?: boolean
      user?: any
    }

    interface Response {
      locals: {
        errorMessage?: string
      }
    }
  }
}

export {}
