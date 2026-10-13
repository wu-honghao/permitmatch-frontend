import { Select } from 'antd'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const handleChange = async (language: string) => {
    await i18n.changeLanguage(language)
    localStorage.setItem('language', language)
  }

  return (
    <Select
      value={i18n.language}
      onChange={handleChange}
      options={[
        {
          value: 'en',
          label: 'English',
        },
        {
          value: 'zh-CN',
          label: '中文',
        },
      ]}
      style={{ width: 110 }}
    />
  )
}