import React from 'react';
import {ipcRenderer} from 'electron';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import Playlist from './Playlist/Playlist';
import Viewer from './Viewer/Viewer';
import AppLocator from '../../AppLocator';
import styles from './App.css';
import RefreshPlaylistUseCase from '../../use-cases/RefreshPlaylistUseCase';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = AppLocator.context.getState();
  }

  componentDidMount() {
    const context = AppLocator.context;
    const onChangeHandler = () => {
      this.setState(context.getState());
    };
    context.onChange(onChangeHandler);

    this.subscribeIpcEvents();
  }

  subscribeIpcEvents() {
    ipcRenderer.on('reload', () => AppLocator.context.useCase(RefreshPlaylistUseCase.create()).execute());
    ipcRenderer.on('search', () => document.getElementsByTagName('input')[0].focus());
  }

  render() {
    const {application, playlist, searchBox, favorite} = this.state;

    return (
      <div className={styles.window}>
        <Header
          isPlaying={!!playlist.currentItemId}
          isFullscreen={application.isFullscreen}
          searchBox={searchBox}
          favorite={favorite}
        />
        <div className={styles.container}>
          <Sidebar
            isFullscreen={application.isFullscreen}
            favorite={favorite}
            searchBox={searchBox}
          />
          <Playlist
            isFullscreen={application.isFullscreen}
            playlist={playlist}
          />
          <Viewer
            isFullscreen={application.isFullscreen}
            item={playlist.currentItem}
          />
        </div>
      </div>
    );
  }
}
