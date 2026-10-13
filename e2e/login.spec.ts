import { test, expect } from '@playwright/test'

test('should complete main job browsing flow',async ({ page })=>{
    // login -> home
    await page.goto('http://localhost:5173/login')
    await page.getByLabel(/email/i).fill('okeahh5@gmail.com')
    await page.getByLabel(/password/i).fill('123455')
    await page.getByRole('button',{ name: /login/i }).click()
    await expect(page).toHaveURL('http://localhost:5173/')

    // search
    await page.getByLabel(/keyword/i).fill('TS Developer')
    await expect(page.getByRole('heading',{ name: /TS Developer/i })).toBeVisible()

    // Job Detail
    const jobCard = page.locator('div').filter({
        hasText: /TS Developer/i
    })
    await jobCard.getByRole('link', { name: /View Details/i }).click()
    await expect(page).toHaveURL(/\/jobs\/[^/]+$/)
    await expect(page.getByRole('heading', { name: /TS Developer/i })).toBeVisible()

    // logout
    await page.getByRole('button', { name: /logout/i }).click()
    await expect(page).toHaveURL(/\/login$/)
})

test('should show error when the password is wrong',async({ page })=>{
    // 1. 错误密码登录
    // → 页面显示 error
    await page.goto('http://localhost:5173/login')
    await page.getByLabel(/email/i).fill('ok@gmail.com')
    await page.getByLabel(/password/i).fill('12')
    await page.getByRole('button',{ name: /login/i }).click()
    await expect(page.getByText(/login email or password is error/i)).toBeVisible()
})

test('should redirect unauthenticated user to login',async ({ page })=>{
    // 2. 未登录直接访问 protected page
    // → 自动跳 /login
    await page.goto('http://localhost:5173/')
    await expect(page).toHaveURL(/\/login$/)
})