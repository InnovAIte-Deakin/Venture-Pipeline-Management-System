import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('nodemailer', () => {
    return {
        default: {
            createTransport: vi.fn(() => ({
                sendMail: vi.fn().mockResolvedValue({ messageId: 'test-message-id' }),
            })),
        },
    }
})

import nodemailer from 'nodemailer'
import { EmailService } from '@/lib/email-service'

describe('EmailService', () => {
    beforeEach(() => {
        vi.stubEnv('SMTP_HOST', 'smtp.test.com')
        vi.stubEnv('SMTP_PORT', '587')
        vi.stubEnv('SMTP_USER', 'testuser')
        vi.stubEnv('SMTP_PASS', 'testpass')
        vi.stubEnv('SMTP_FROM_EMAIL', 'noreply@test.com')
    })

    afterEach(() => {
        vi.unstubAllEnvs()
        vi.clearAllMocks()
    })

    // Additional tests for sendIntakeNotificationEmail
    describe('sendIntakeNotificationEmail', () => {
        it('returns false and never calls sendMail when SMTP is not configured', async () => {
            vi.unstubAllEnvs()
            const service = new EmailService()
            const result = await service.sendIntakeNotificationEmail({
                founderEmail: 'founder@test.com',
                founderName: 'Test Founder',
                ventureName: 'Test Venture',
            })
            expect(result).toBe(false)
        })

        it('sends with correct recipient and content when configured', async () => {
            const service = new EmailService()
            const result = await service.sendIntakeNotificationEmail({
                founderEmail: 'founder@test.com',
                founderName: 'Test Founder',
                ventureName: 'Test Venture',
                country: 'Australia',
            })
            expect(result).toBe(true)

            const mockTransport = (nodemailer.createTransport as any).mock.results[0].value
            const sentMail = mockTransport.sendMail.mock.calls[0][0]
            expect(sentMail.to).toBe('founder@test.com')
            expect(sentMail.from).toContain('noreply@test.com')
            expect(sentMail.from).toContain('Mekong Inclusive Ventures')
            expect(sentMail.html).toContain('Test Founder')
            expect(sentMail.html).toContain('Test Venture')
        })

        it('returns false and does not throw when sendMail fails', async () => {
            const service = new EmailService()
            const mockTransport = (nodemailer.createTransport as any).mock.results[0].value
            mockTransport.sendMail.mockRejectedValueOnce(new Error('SMTP connection failed'))
            const result = await service.sendIntakeNotificationEmail({
                founderEmail: 'founder@test.com',
                founderName: 'Test Founder',
                ventureName: 'Test Venture',
            })
            expect(result).toBe(false)
        })

        it('sets secure true for port 465', async () => {
            vi.stubEnv('SMTP_PORT', '465')
            new EmailService()
            expect(nodemailer.createTransport).toHaveBeenCalledWith(
                expect.objectContaining({ secure: true })
            )
        })

        it('sets secure false for port 587', async () => {
            new EmailService()
            expect(nodemailer.createTransport).toHaveBeenCalledWith(
                expect.objectContaining({ secure: false })
            )
        })
    })

    // Additional tests for sendAdminNotificationEmail
    describe('sendAdminNotificationEmail', () => {
        it('returns false and never calls sendMail when SMTP is not configured', async () => {
            vi.unstubAllEnvs()
            const service = new EmailService()
            const result = await service.sendAdminNotificationEmail({
                ventureName: 'Test Venture',
                founderName: 'Test Founder',
                founderEmail: 'founder@example.com',
            })
            expect(result).toBe(false)
        })

        it('sends with correct recipient and content when configured', async () => {
            vi.stubEnv('ADMIN_NOTIFICATION_EMAIL', 'admin@example.com')
            const service = new EmailService()
            const result = await service.sendAdminNotificationEmail({
                ventureName: 'Test Venture',
                founderName: 'Test Founder',
                founderEmail: 'founder@example.com',
                country: 'Australia',
            })
            expect(result).toBe(true)

            const mockTransport = (nodemailer.createTransport as any).mock.results[0].value
            const sentMail = mockTransport.sendMail.mock.calls[0][0]
            expect(sentMail.to).toBe('admin@example.com')
            expect(sentMail.from).toContain('noreply@test.com')
            expect(sentMail.from).toContain('Mekong Inclusive Ventures')
            expect(sentMail.html).toContain('Test Venture')
            expect(sentMail.html).toContain('Test Founder')
        })

        it('returns false and does not throw when sendMail fails', async () => {
            vi.stubEnv('ADMIN_NOTIFICATION_EMAIL', 'admin@example.com')
            const service = new EmailService()
            const mockTransport = (nodemailer.createTransport as any).mock.results[0].value
            mockTransport.sendMail.mockRejectedValueOnce(new Error('SMTP connection failed'))
            const result = await service.sendAdminNotificationEmail({
                ventureName: 'Test Venture',
                founderName: 'Test Founder',
                founderEmail: 'founder@example.com',
            })
            expect(result).toBe(false)
        })

        it('sets secure true for port 465', async () => {
            vi.stubEnv('ADMIN_NOTIFICATION_EMAIL', 'admin@example.com')
            vi.stubEnv('SMTP_PORT', '465')
            new EmailService()
            expect(nodemailer.createTransport).toHaveBeenCalledWith(
                expect.objectContaining({ secure: true })
            )
        })

        it('sets secure false for port 587', async () => {
            vi.stubEnv('ADMIN_NOTIFICATION_EMAIL', 'admin@example.com')
            new EmailService()
            expect(nodemailer.createTransport).toHaveBeenCalledWith(
                expect.objectContaining({ secure: false })
            )
        })

        it('returns false and skips sending when ADMIN_NOTIFICATION_EMAIL is unset', async () => {
            const service = new EmailService()
            const result = await service.sendAdminNotificationEmail({
                ventureName: 'Test Venture',
                founderName: 'Test Founder',
                founderEmail: 'founder@example.com',
            })
            expect(result).toBe(false)

            const mockTransport = (nodemailer.createTransport as any).mock.results[0]?.value
            expect(mockTransport?.sendMail).not.toHaveBeenCalled()
        })
    })

    // Additional tests for Configuration status
    it('lists exactly the missing SMTP variables', () => {
        vi.unstubAllEnvs()
        vi.stubEnv('SMTP_HOST', 'smtp.test.com')
        const service = new EmailService()
        const status = service.getConfigurationStatus()
        expect(status.configured).toBe(false)
        expect(status.missing).toEqual(['SMTP_USER', 'SMTP_PASS'])
    })
})
