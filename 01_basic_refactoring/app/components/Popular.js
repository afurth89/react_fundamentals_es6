const React = require('react');
const PropTypes = require('prop-types');
const api = require('../utils/api');
const Loading = require('./Loading')

function SelectLanguage (props) {
  const languages = ["All", "JavaScript", "Ruby", "Java", "CSS", "Python"];

  return (
    <ul className='languages'>  
      {languages.map((lang) => {
        return (
          <li 
            style={lang === props.selectedLanguage ? {color: '#d0021b'} : null}
            onClick={() => props.onSelect(lang)}
            key={lang}
          >
            {lang}
          </li>
        )
      })}
    </ul>
  )
}

function RepoGrid (props) {
  return (
    <ul className='popular-list'>
      {props.repos.map((repo, index) => {
        const { owner, html_url, name , stargazers_count } = repo
        const { avatar_url, login } = owner
        return (
          <li key={name} className='popular-item'>
            <div className='popular-rank'>#{index + 1}</div>
            <ul className='space-list-items'>
              <li>
                <img 
                  className='avatar'
                  src={avatar_url}
                  alt={`Avatar for ${login}`}
                />
              </li>
              <li><a href={html_url}>{name}</a></li>
              <li>@{login}</li>
              <li>{stargazers_count} stars</li>
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
}


class Popular extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: 'All',
      repos: null 
    };

    this.updateLanguage = this.updateLanguage.bind(this);
  }

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage)
  }

  updateLanguage(lang) {
    this.setState(() => {
      return {
        selectedLanguage: lang,
        repos: null
      }
    })
    
    api.fetchPopularRepos(lang)
      .then((repos) => this.setState(() => ({ repos })));
  }

  render() {
    const { repos, selectedLanguage } = this.state;
    return (
      <div>
        <SelectLanguage 
          selectedLanguage={selectedLanguage}
          onSelect={this.updateLanguage}
        />
        { !repos
            ? <Loading />
            : <RepoGrid repos={repos} /> }
      </div>
    )
  }
  
}

module.exports = Popular