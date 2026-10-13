import { describe, it, expect, vi, afterEach } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import JobSearch from "../components/JobSearch"

afterEach(()=>{
  cleanup()
})
describe("JobSearch", () => {
  it("should update keyword when user types", async () => {
    const user = userEvent.setup()

    const search = {
      keyword: "",
      location: "",
      permitSupported: false
    }

    const setSearch = vi.fn()
    const onFilterChange = vi.fn()

    render(
      <JobSearch
        search={search}
        setSearch={setSearch}
        onFilterChange={onFilterChange}
      />
    )

    const keywordInput = screen.getByRole("textbox",{ name: /keyword/i })

    await user.type(keywordInput, "React")

    expect(setSearch).toHaveBeenCalled()
  })

  it('should test location pick for jobSearch', async() => {
    const search = {
      keyword: "",
      location: "",
      permitSupported: false
    }

    const setSearch = vi.fn()
    const onFilterChange = vi.fn()

    render(<JobSearch search={search} setSearch={setSearch} onFilterChange={onFilterChange}/>)

    const locationSelect = screen.getByRole('combobox',{
      name: /location/i
    })

    const user = userEvent.setup()

    await user.selectOptions(locationSelect,'Cork')

    expect(setSearch).toHaveBeenCalled()
    expect(onFilterChange).toHaveBeenCalled()
    // 渲染
    // → 找元素
    // → 用户操作
    // → 检查结果
  })

  it('should test permitSupported pick for jobSearch',async ()=>{
    const search = {
      keyword: "",
      location: "",
      permitSupported: false
    } 

    const setSearch = vi.fn()
    const onFilterChange = vi.fn()

    render(<JobSearch search={search} setSearch={setSearch} onFilterChange={onFilterChange}/>)

    const permitSupportedCheckbox = screen.getByRole('checkbox',{
      name:/Permit supported only/i
    })

    const user = userEvent.setup()

    await user.click(permitSupportedCheckbox)

    expect(setSearch).toHaveBeenCalled()
    expect(onFilterChange).toHaveBeenCalled()
  })
})