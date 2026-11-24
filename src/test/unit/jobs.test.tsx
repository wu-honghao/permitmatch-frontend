import { describe, it, vi, expect, afterEach } from 'vitest'
import { renderWithProviders } from '../utils/renderWithProviders';
import Jobs from '../../pages/Jobs/Jobs';
import { screen, cleanup, within, waitFor } from '@testing-library/react';
import { deleteAPI, getAPI } from '../../api/api';
import userEvent from '@testing-library/user-event';

vi.mock('../../api/api',()=>({
    getAPI: vi.fn(),
    deleteAPI: vi.fn()
}))
const mockJobs = [
  {
    _id: "job-001",
    title: "React Developer",
    company: "ABC Ltd",
    location: "Dublin",
    skillScore: 85,
    scoreType: "weighted",
    latestAnalysisId: null,
    updatedAt: "2026-11-18T10:00:00.000Z",
  }
]
afterEach(() => {
  cleanup();
});

describe("", () => {
    it("F01: should display jobs after API loads", async () => {
        // Arrange: 模拟 API 返回岗位
        vi.mocked(getAPI).mockResolvedValue({
            data: mockJobs,
        });

        // Act: 渲染真实组件
        renderWithProviders(<Jobs />)

        // Assert: 验证用户看到的数据
        expect(await screen.findByText('React Developer')).toBeInTheDocument()
        expect(await screen.findByText('ABC Ltd')).toBeInTheDocument()
        expect(await screen.findByText('85 / 100')).toBeInTheDocument()
    });

    it("F02: should display empty state when no jobs exist", async () => {
        // Arrange
        vi.mocked(getAPI).mockResolvedValue({
            data: [],
        });

        // Act
        renderWithProviders(<Jobs />);

        // Assert
        expect(await screen.findByText('No data found')).toBeInTheDocument()
    });

    it("F03: should display fail to load when api error", async () => {
        // Arrange
        vi.mocked(getAPI).mockRejectedValue(new Error('Network error'))

        // Act
        renderWithProviders(<Jobs />);

        // Assert
        expect(await screen.findByText('Failed to load')).toBeInTheDocument()

        expect(screen.queryByText('React Developer'))
        .not.toBeInTheDocument();
    });

    it("F04: should delete a job after confirmation", async () => {
        const user = userEvent.setup();

        vi.mocked(getAPI)
            .mockResolvedValueOnce({ data: mockJobs })
            .mockResolvedValueOnce({ data: [] });
        vi.mocked(deleteAPI).mockResolvedValue(null);

        renderWithProviders(<Jobs />);

        const jobTitle = await screen.findByText('React Developer')
        const row = jobTitle.closest('tr')!;

        await user.click(within(row).getByRole('button', { name: 'Delete Job' }))
        await user.click(screen.getByRole('button', { name: 'Yes' }))

        expect(deleteAPI).toHaveBeenCalledTimes(1);
        expect(deleteAPI).toHaveBeenCalledWith(
            expect.objectContaining({
                url: '/jobs/job-001',
            })
        );
        await waitFor(()=>{
            expect(screen.queryByText('React Developer'))
                .not.toBeInTheDocument()
        })
    })

    it("F05", async () => {
        const user = userEvent.setup();

        vi.mocked(getAPI)
            .mockResolvedValueOnce({ data: mockJobs })
            
        vi.mocked(deleteAPI).mockResolvedValue(null);

        renderWithProviders(<Jobs />);

        const jobTitle = await screen.findByText('React Developer')
        const row = jobTitle.closest('tr')!;

        await user.click(within(row).getByRole('button', { name: 'Delete Job' }))
        await user.click(screen.getByRole('button', { name: 'No' }))

        expect(deleteAPI).not.toHaveBeenCalled()
        expect(screen.getByText('React Developer')).toBeInTheDocument();
    })

    it("F06", async () => {
        const user = userEvent.setup();

        vi.mocked(getAPI)
            .mockResolvedValueOnce({ data: mockJobs })
            
        vi.mocked(deleteAPI).mockRejectedValue(new Error('Server error'));

        renderWithProviders(<Jobs />);

        const jobTitle = await screen.findByText('React Developer')
        const row = jobTitle.closest('tr')!;

        await user.click(within(row).getByRole('button', { name: 'Delete Job' }))
        await user.click(screen.getByRole('button', { name: 'Yes' }))

        expect(deleteAPI).toHaveBeenCalledTimes(1)
        expect(screen.getByText('React Developer')).toBeInTheDocument();
        expect(await screen.findByText('Failed to delete')).toBeInTheDocument();
        expect(getAPI).toHaveBeenCalledTimes(1);
    })
})