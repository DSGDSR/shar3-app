import { History, Locale, Settings, Translator } from '@shared';
import { useLocalStorage, useTheme } from '@hooks';
import SettingsCheckbox from './Checkbox';
import { Modal } from 'flowbite-react';
import LanguageSelector from './LanguageSelector';
import TextInput from './TextInput';
import { debounce } from '@utils';
import { useT } from 'talkr';
import Button from '@components/Button';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'sonner';

const defaultSettings: Settings = {
    locale: 'en',
    publicShare: false,
    theme: 'dark',
    auth: null,
    shortcuts: true
}

interface SettingsModalProps {
    setHistory: Dispatch<SetStateAction<History>>
    show: boolean
    onClose: () => void
}

const SettingsModal = ({ setHistory, show, onClose }: SettingsModalProps) => {
    const [historyClicks, setHistoryClicks] = useState(0)
    const {value: settings, setValue: setSettings} = useLocalStorage<Settings>('settings', defaultSettings)
    const {setTheme} = useTheme()
    const { T } = useT()

    const handleChange = (key: keyof Settings, value: any) => {
        if (key === 'theme') {
            setTheme(value)
        }

        setSettings((oldConfig) => ({
            ...oldConfig,
            [key]: value ?? null
        }));
    };

    const clearHistory = () => {
        setHistoryClicks((clicks) => {
            if (clicks) {
                toast.success('THistory has been cleared')
                setHistory([]);
                return 0
            } else {
                toast.message('TPress the button again to confirm the action')
                return 1
            }
        })
    }

    return (
        <Modal
          dismissible={true}
          show={show}
          onClose={onClose}
        >
            <Modal.Header>{T('settings.title')}</Modal.Header>
            <Modal.Body>
                <SettingsSections title="settings.general_settings">
                    <SettingsCheckbox label={T('settings.public_share')} isChecked={settings.publicShare}
                        onChange={(event) => handleChange('publicShare', event.target.checked)}
                        info={T('settings.public_share_tooltip')}
                    />
                    <SettingsCheckbox label={T('settings.dark_theme')} isChecked={settings.theme === 'dark'}
                        onChange={(event) => handleChange('theme', event.target.checked ? 'dark' : 'light')}
                    />
                    <SettingsCheckbox label={T('settings.shortcuts')} isChecked={settings.shortcuts}
                        onChange={(event) => handleChange('shortcuts', event.target.checked)}
                    />
                </SettingsSections>

                <SettingsSections title="settings.auth">
                    <SettingsCheckbox isChecked={settings.auth?.enabled}
                        onChange={(event) => handleChange('auth', {
                            enabled: event.target.checked,
                            username: settings.auth?.username,
                            password: settings.auth?.password
                        })}
                    />
                    { settings.auth?.enabled && <>
                        <fieldset>
                            <TextInput className='mb-2' name="username"
                                placeholder={T('settings.auth_username')}
                                value={settings.auth?.username ?? ''}
                                onChange={debounce((event: React.ChangeEvent<HTMLInputElement>) => handleChange('auth', {
                                    enabled: settings.auth?.enabled,
                                    username: event.target.value || null,
                                    password: settings.auth?.password
                                }), 750)}
                            />
                            <TextInput name="password"
                                placeholder={T('settings.auth_password')}
                                value={settings.auth?.password ?? ''}
                                onChange={debounce((event: React.ChangeEvent<HTMLInputElement>) => handleChange('auth', {
                                    enabled: settings.auth?.enabled,
                                    password: event.target.value || null,
                                    username: settings.auth?.username
                                }), 750)}
                            />
                            { ((settings.auth?.username && !settings.auth?.password) || (settings.auth?.password && !settings.auth?.username)) &&
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">{T('settings.auth_warning')}</p> }
                        </fieldset>
                    </> }
                </SettingsSections>

                <SettingsSections title="settings.other_settings">
                    <Button onClick={clearHistory}>TLimpiar historial{T('settings.clean_history')}</Button>
                </SettingsSections>

                <SettingsSections title="settings.language" className="!mb-0">
                    <LanguageSelector T={T} onChange={(locale: Locale) => handleChange('locale', locale)} />
                </SettingsSections>
            </Modal.Body>
        </Modal>
    )
}

const SettingsSections = ({title, children, className, ...props}: any) => {
    const { T } = useT()

    return <section className={`space-y-4 mb-8 ${className}`} {...props}>
        <h4 className='text-md font-semibold text-gray-900 dark:text-white'>{T(title)}</h4>
        { children }
    </section>
}

export default SettingsModal