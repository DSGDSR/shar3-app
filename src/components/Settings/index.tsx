import Modal from '@components/Modal'
import { Settings } from '@shared';
import { useLocalStorage, useTheme } from '@hooks';
import SettingsCheckbox from './Checkbox';

export const defaultSettings: Settings = {
    publicShare: false,
    theme: 'dark',
    auth: null,
    shortcuts: true
}

const SettingsModal = () => {
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
            id="settings"
            title='Settings'
            body={<>
                <section>
                    <h4 className='text-md font-semibold text-gray-900 dark:text-white mb-4'>General settings</h4>
                    <SettingsCheckbox label='Public share' isChecked={settings.publicShare}
                        callback={(event) => handleChange('publicShare', event.target.checked)}
                        info='When enabled files will be shared outside of your local network using a public url, useful if you want to share things with your friends ✨'
                    />
                    <SettingsCheckbox label='Dark theme' isChecked={settings.theme === 'dark'}
                        callback={(event) => handleChange('theme', event.target.checked ? 'dark' : 'light')}
                    />
                </section>

                <section>
                    <h4 className='text-md font-semibold text-gray-900 dark:text-white mb-2'>Auth credentials</h4>
                    <SettingsCheckbox isChecked={settings.auth?.enabled}
                        callback={(event) => handleChange('auth', {
                            enabled: event.target.checked,
                            username: settings.auth?.username,
                            password: settings.auth?.password
                        })}
                    />
                    { settings.auth?.enabled && <>
                        <fieldset>
                            <input
                                type="text" placeholder="User name"
                                value={settings.auth?.username ?? ''}
                                onChange={(event) => handleChange('auth', {
                                    enabled: settings.auth?.enabled,
                                    username: event.target.value || null,
                                    password: settings.auth?.password
                                })}
                                className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            <input
                                type="password" placeholder="Password"
                                value={settings.auth?.password ?? ''}
                                onChange={(event) => handleChange('auth', {
                                    enabled: settings.auth?.enabled,
                                    password: event.target.value || null,
                                    username: settings.auth?.username
                                })}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            { ((settings.auth?.username && !settings.auth?.password) || (settings.auth?.password && !settings.auth?.username)) &&
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">You need to add both username and password for auth to be enabled.</p> }
                        </fieldset>
                    </> }
                </section>

                <section>
                    <h4 className='text-md font-semibold text-gray-900 dark:text-white mb-2'>Other settings</h4>
                    <SettingsCheckbox label='Shortcuts' isChecked={settings.shortcuts}
                        callback={(event) => handleChange('shortcuts', event.target.checked)}
                    />
                </section>
            </>}
            footer={<></>}
        />
    )
}

export default SettingsModal