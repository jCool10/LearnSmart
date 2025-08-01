import nodemailer from 'nodemailer'
import { configs } from '@/configs'
import { BadRequestError, InternalServerError } from '@/cores/error.handler'
import { EMAIL } from '@/constants'
import logger from '@/configs/logger.config'

export interface EmailOptions {
  to: string
  subject: string
  text: string
  html?: string
  from?: string
}

export interface EmailTemplateData {
  username?: string
  resetPasswordUrl?: string
  verificationEmailUrl?: string
  appName?: string
  supportEmail?: string
  [key: string]: any
}

export interface WelcomeEmailData extends EmailTemplateData {
  username: string
  appName: string
}

export interface ResetPasswordEmailData extends EmailTemplateData {
  username: string
  resetPasswordUrl: string
  appName: string
}

export interface VerificationEmailData extends EmailTemplateData {
  username: string
  verificationEmailUrl: string
  appName: string
}

export class EmailService {
  private transporter: nodemailer.Transporter
  private readonly fromEmail: string
  private readonly frontendUrl: string

  constructor() {
    this.fromEmail =
      process.env.SMTP_FROM || `${configs.app.name} <noreply@${configs.app.name.toLowerCase().replace(/\s+/g, '')}.com>`
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'

    // Initialize email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || ''
      },
      // Connection timeout and retry settings
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000 // 60 seconds
    })

    // Verify connection configuration
    this.verifyConnection()
  }

  /**
   * Verify email server connection
   */
  private async verifyConnection(): Promise<void> {
    if (process.env.NODE_ENV === 'test') return

    try {
      await this.transporter.verify()
      logger.info('Email service initialized successfully')
    } catch (error: any) {
      logger.warn('Email service connection failed', {
        error: error.message,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT
      })
      console.warn('⚠️  Email service unavailable. Configure SMTP settings in .env for email functionality.')
    }
  }

  /**
   * Send an email with comprehensive error handling
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    const { to, subject, text, html, from } = options

    if (!to || !subject || !text) {
      throw new BadRequestError('Email requires: to, subject, and text fields')
    }

    const emailMessage = {
      from: from || this.fromEmail,
      to,
      subject,
      text,
      html,
      // Add some headers for better deliverability
      headers: {
        'X-Mailer': `${configs.app.name} Email Service`,
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal'
      }
    }

    try {
      logger.info('Sending email', { to, subject, from: emailMessage.from })
      const result = await this.transporter.sendMail(emailMessage)
      logger.info('Email sent successfully', {
        to,
        subject,
        messageId: result.messageId,
        response: result.response
      })
    } catch (error: any) {
      logger.error('Failed to send email', {
        error: error.message,
        to,
        subject,
        code: error.code,
        command: error.command
      })
      throw new InternalServerError(`Failed to send email: ${error.message}`)
    }
  }

  /**
   * Generate welcome email template
   */
  private generateWelcomeTemplate(data: WelcomeEmailData): { text: string; html: string } {
    const { username, appName } = data

    const text = `Welcome to ${appName}!

Dear ${username},

Welcome to ${appName}! We're excited to have you on board.

Your account has been successfully created and you can now start using our platform.

If you have any questions, feel free to contact our support team.

Best regards,
The ${appName} Team`

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0;">${appName}</h1>
        </div>
        
        <h2 style="color: #007bff;">Welcome to ${appName}!</h2>
        
        <p>Dear ${username},</p>
        
        <p>Welcome to ${appName}! We're excited to have you on board.</p>
        
        <p>Your account has been successfully created and you can now start using our platform.</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${this.frontendUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Get Started</a>
        </div>
        
        <p>If you have any questions, feel free to contact our support team.</p>
        
        <p style="margin-top: 30px;">Best regards,<br>The ${appName} Team</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `

    return { text, html }
  }

  /**
   * Generate reset password email template
   */
  private generateResetPasswordTemplate(data: ResetPasswordEmailData): { text: string; html: string } {
    const { username, resetPasswordUrl, appName } = data

    const text = `Password Reset Request - ${appName}

Dear ${username || 'User'},

You have requested to reset your password for your ${appName} account.

To reset your password, click on this link: ${resetPasswordUrl}

This link will expire in 10 minutes for security reasons.

If you did not request this password reset, please ignore this email or contact our support team if you have concerns.

Best regards,
The ${appName} Team`

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0;">${appName}</h1>
        </div>
        
        <h2 style="color: #dc3545;">Password Reset Request</h2>
        
        <p>Dear ${username || 'User'},</p>
        
        <p>You have requested to reset your password for your ${appName} account.</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${resetPasswordUrl}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
        </div>
        
        <p style="font-size: 14px; color: #666; text-align: center;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetPasswordUrl}" style="color: #007bff; word-break: break-all;">${resetPasswordUrl}</a>
        </p>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p style="margin: 0; color: #856404;">
            <strong>⚠️ Security Notice:</strong> This link will expire in 10 minutes for security reasons.
          </p>
        </div>
        
        <p>If you did not request this password reset, please ignore this email or contact our support team if you have concerns.</p>
        
        <p style="margin-top: 30px;">Best regards,<br>The ${appName} Team</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `

    return { text, html }
  }

  /**
   * Generate email verification template
   */
  private generateVerificationTemplate(data: VerificationEmailData): { text: string; html: string } {
    const { username, verificationEmailUrl, appName } = data

    const text = `Email Verification - ${appName}

Dear ${username || 'User'},

Thank you for registering with ${appName}!

To complete your registration and verify your email address, click on this link: ${verificationEmailUrl}

This link will expire in 24 hours for security reasons.

If you did not create an account with ${appName}, please ignore this email.

Best regards,
The ${appName} Team`

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0;">${appName}</h1>
        </div>
        
        <h2 style="color: #28a745;">Email Verification</h2>
        
        <p>Dear ${username || 'User'},</p>
        
        <p>Thank you for registering with ${appName}!</p>
        
        <p>To complete your registration and verify your email address, click on the button below:</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${verificationEmailUrl}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Verify Email</a>
        </div>
        
        <p style="font-size: 14px; color: #666; text-align: center;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${verificationEmailUrl}" style="color: #007bff; word-break: break-all;">${verificationEmailUrl}</a>
        </p>
        
        <div style="background-color: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #17a2b8;">
          <p style="margin: 0; color: #0c5460;">
            <strong>ℹ️ Note:</strong> This verification link will expire in 24 hours for security reasons.
          </p>
        </div>
        
        <p>If you did not create an account with ${appName}, please ignore this email.</p>
        
        <p style="margin-top: 30px;">Best regards,<br>The ${appName} Team</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `

    return { text, html }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(to: string, username: string): Promise<void> {
    const data: WelcomeEmailData = {
      username,
      appName: configs.app.name
    }

    const { text, html } = this.generateWelcomeTemplate(data)

    await this.sendEmail({
      to,
      subject: EMAIL.SUBJECTS.WELCOME,
      text,
      html
    })
  }

  /**
   * Send reset password email
   */
  async sendResetPasswordEmail(to: string, token: string, username?: string): Promise<void> {
    const resetPasswordUrl = `${this.frontendUrl}/reset-password?token=${token}`

    const data: ResetPasswordEmailData = {
      username: username || 'User',
      resetPasswordUrl,
      appName: configs.app.name
    }

    const { text, html } = this.generateResetPasswordTemplate(data)

    await this.sendEmail({
      to,
      subject: EMAIL.SUBJECTS.PASSWORD_RESET,
      text,
      html
    })
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(to: string, token: string, username?: string): Promise<void> {
    const verificationEmailUrl = `${this.frontendUrl}/verify-email?token=${token}`

    const data: VerificationEmailData = {
      username: username || 'User',
      verificationEmailUrl,
      appName: configs.app.name
    }

    const { text, html } = this.generateVerificationTemplate(data)

    await this.sendEmail({
      to,
      subject: EMAIL.SUBJECTS.EMAIL_VERIFICATION,
      text,
      html
    })
  }

  /**
   * Send password changed notification
   */
  async sendPasswordChangedEmail(to: string, username?: string): Promise<void> {
    const text = `Password Changed - ${configs.app.name}

Dear ${username || 'User'},

Your password has been successfully changed for your ${configs.app.name} account.

If you did not make this change, please contact our support team immediately.

Best regards,
The ${configs.app.name} Team`

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0;">${configs.app.name}</h1>
        </div>
        
        <h2 style="color: #28a745;">Password Changed Successfully</h2>
        
        <p>Dear ${username || 'User'},</p>
        
        <p>Your password has been successfully changed for your ${configs.app.name} account.</p>
        
        <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
          <p style="margin: 0; color: #155724;">
            <strong>✅ Success:</strong> Your account is now secured with your new password.
          </p>
        </div>
        
        <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
          <p style="margin: 0; color: #721c24;">
            <strong>⚠️ Security Alert:</strong> If you did not make this change, please contact our support team immediately.
          </p>
        </div>
        
        <p style="margin-top: 30px;">Best regards,<br>The ${configs.app.name} Team</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `

    await this.sendEmail({
      to,
      subject: EMAIL.SUBJECTS.PASSWORD_CHANGED,
      text,
      html
    })
  }
}
