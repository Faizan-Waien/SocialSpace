import './STYLING/Settings.scss'
import PrivacySettings from './privacySettings'
import ProfileSettings from './ProfileSettings'

const Settings = () => {

    const handleTab1 = () => {
        document.getElementById('t1').style.display = 'flex'
        document.getElementById('t2').style.display = 'none'
        document.getElementById('b1').style.background = '#232377'
        document.getElementById('b2').style.background = '#666b8d'
    }

    const handleTab2 = () => {
        document.getElementById('t1').style.display = 'none'
        document.getElementById('t2').style.display = 'flex'
        document.getElementById('b1').style.background = '#666b8d'
        document.getElementById('b2').style.background = '#232377'
    }

    return (
        <div className='settingmain'>

            <div style={{ display: 'flex', gap: 2 }}>
                <button id='b1' className='tab' onClick={handleTab1} style={{ background: '#232377' }}>Profile</button>
                <button id='b2' className='tab' onClick={handleTab2} style={{ background: '#666b8d' }}>Privacy</button>
            </div>

            <div style={{ background: '#232377', padding: '0px 20px' }}>
                <h2>Settings</h2>
            </div>

            <div>
                <div id='t1' style={{ display: 'flex' }}>
                    <ProfileSettings />
                </div>

                <div id='t2' style={{ display: 'none' }}>
                    <PrivacySettings />
                </div>
            </div>
        </div>
    )
}

export default Settings