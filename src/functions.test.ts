import {
    countPendingAdminReports,
    isPendingAdminReport,
} from './functions'

describe('isPendingAdminReport', () => {
    it('compte un signalement encore en attente', () => {
        expect(
            isPendingAdminReport({ kind: 'report', status: 'pending' })
        ).toBe(true)
        expect(isPendingAdminReport({ kind: 'report' })).toBe(true)
    })

    it('ignore les vus, réglés, supprimés et le reste des props', () => {
        expect(
            isPendingAdminReport({ kind: 'report', status: 'seen' })
        ).toBe(false)
        expect(
            isPendingAdminReport({ kind: 'report', status: 'resolved' })
        ).toBe(false)
        expect(
            isPendingAdminReport({
                kind: 'report',
                status: 'pending',
                deletedAt: { toMillis: () => Date.now() },
            })
        ).toBe(false)
        expect(isPendingAdminReport({ kind: 'sms-config' })).toBe(false)
        expect(isPendingAdminReport(null)).toBe(false)
    })
})

describe('countPendingAdminReports', () => {
    it('compte seulement les nouveaux signalements', () => {
        expect(
            countPendingAdminReports([
                { kind: 'report', status: 'pending' },
                { kind: 'report' },
                { kind: 'report', status: 'seen' },
                { kind: 'app-data' },
                { kind: 'report', deletedAt: new Date() },
            ])
        ).toBe(2)
    })
})
