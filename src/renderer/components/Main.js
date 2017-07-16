import React from 'react';
import {ipcRenderer} from 'electron';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import Playlist from './Playlist/Playlist';
import LiveViewer from './LiveViewer/LiveViewer';
import CommentViewer from './CommentViewer/CommentViewer';
import AppLocator from '../AppLocator';
import styles from './Main.css';
import RefreshPlaylistUseCase from '../use-cases/RefreshPlaylistUseCase';

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
        {
          application.screenMode !== 'fullscreen' ? (
            <Header
              isPlaying={!!playlist.currentItemId}
              searchBox={searchBox}
              favorite={favorite}
            />
          ) : null
        }
        <div className={styles.container}>
          {
            application.screenMode === 'playlist' ? (
              <Sidebar
                favorite={favorite}
                searchBox={searchBox}
              />
            ) : null
          }
          {application.screenMode === 'playlist' ? (<Playlist playlist={playlist} />) : null}
          <CommentViewer
            screenMode={application.screenMode}
            item={playlist.currentItem}
          />
          <LiveViewer
            screenMode={application.screenMode}
            item={playlist.currentItem}
          />
        </div>
      </div>
    );
  }
}
