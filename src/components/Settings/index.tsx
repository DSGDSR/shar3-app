import { Locale, Settings, Translator } from '@shared';
import { useLocalStorage, useTheme } from '@hooks';
import SettingsCheckbox from './Checkbox';
import { Modal } from 'flowbite-react';
import LanguageSelector from '@components/LanguageSelector';
import TextInput from './TextInput';
import { debounce } from '@utils';

const defaultSettings: Settings = {
    locale: 'en',
    publicShare: false,
    theme: 'dark',
    auth: null,
    shortcuts: true
}

interface SettingsModalProps {
    show: boolean
    onClose: () => void
    T: Translator
}

const SettingsModal = ({show, onClose, T}: SettingsModalProps) => {
    const {value: settings, setValue: setSettings} = useLocalStorage<Settings>('settings', defaultSettings)
    const {setTheme} = useTheme()

    const handleChange = (key: keyof Settings, value: any) => {
        if (key === 'theme') {
            setTheme(value)
        }

        setSettings((oldConfig) => ({
            ...oldConfig,
            [key]: value ?? null
        }));
    };

    return (
        <Modal
          dismissible={true}
          show={show}
          onClose={onClose}
          className="h-screen"
        >
            <Modal.Header>{T('settings.title')}</Modal.Header>
            <Modal.Body>
                <section className="space-y-4 mb-6">
                    <h4 className='text-md font-semibold text-gray-900 dark:text-white'>{T('settings.general_settings')}</h4>
                    <SettingsCheckbox label={T('settings.public_share')} isChecked={settings.publicShare}
                        onChange={(event) => handleChange('publicShare', event.target.checked)}
                        info={T('settings.public_share_tooltip')}
                    />
                    <SettingsCheckbox label={T('settings.dark_theme')} isChecked={settings.theme === 'dark'}
                        onChange={(event) => handleChange('theme', event.target.checked ? 'dark' : 'light')}
                    />
                </section>

                <section className="space-y-4 mb-6">
                    <h4 className='text-md font-semibold text-gray-900 dark:text-white mb-2'>{T('settings.auth')}</h4>
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
                </section>

                <section className="space-y-4 mb-6">
                    <h4 className='text-md font-semibold text-gray-900 dark:text-white mb-2'>{T('settings.other_settings')}</h4>
                    <SettingsCheckbox label={T('settings.shortcuts')} isChecked={settings.shortcuts}
                        onChange={(event) => handleChange('shortcuts', event.target.checked)}
                    />
                </section>

                <section className="space-y-4">
                    <h4 className='text-md font-semibold text-gray-900 dark:text-white'>{T('settings.language')}</h4>
                    <LanguageSelector T={T} onChange={(locale: Locale) => handleChange('locale', locale)} />
                </section>
            </Modal.Body>
        </Modal>
    )
}

export default SettingsModal