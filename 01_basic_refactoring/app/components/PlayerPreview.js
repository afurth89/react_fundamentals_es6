const React = require('react');
const PropTypes = require('prop-types');

function PlayerPreview ({avatar, username, children}) {
  return (
    <div className='column'>
      <img 
        className='avatar'
        src={avatar} 
        alt={'Avatar for ' + username}
      />
      <h2 className='username'>
        @{username}
      </h2>
      {children}
    </div>
  )
}

PlayerPreview.propTypes = {
  username: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired
}

module.exports = PlayerPreview