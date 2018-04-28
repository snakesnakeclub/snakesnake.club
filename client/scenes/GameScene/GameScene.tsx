import { h, Component } from 'preact';
import ServicesInterface from '../../services/interface';
import Dialog from '../../components/Dialog';
import ButtonText from '../../components/ButtonText';
import './GameScene.scss';

interface PropTypes {
  services: ServicesInterface;
}

interface StateTypes {
  isAlive: boolean;
  deaths: number;
}

export default class GameScene extends Component<PropTypes, StateTypes> {
  private canvas: HTMLCanvasElement = null;

  constructor(props) {
    super(props);
    this.state = {
      isAlive: false,
      deaths: 0,
    }
    this.handleDeath = this.handleDeath.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
  }

  componentDidMount() {
    const {
      gameService,
    } = this.props.services;

    gameService.setCanvas(this.canvas);
    gameService.on('death', this.handleDeath);

    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();
  }

  componentWillUnmount() {
    const {
      gameService,
    } = this.props.services;

    gameService.removeListener('death', this.handleDeath);
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  handleSpawn() {
    const {
      gameService,
    } = this.props.services;
    gameService.spawn();
    this.setState({
      isAlive: true,
    })
  }

  handleLeaveRoom() {
    const {
      gameService,
    } = this.props.services;
    gameService.leaveRoom();
  }

  handleDeath() {
    this.setState(({ deaths }) => ({
      isAlive: false,
      deaths: deaths + 1,
    }))
  }

  render() {
    const {
      isAlive,
      deaths,
    } = this.state;
    return (
      <div>
        <canvas className="GameScene--canvas"
          ref={el => { this.canvas = el as HTMLCanvasElement }} />

        <Dialog shown={!isAlive}
          modal={true}
          actions={[
            <ButtonText value="Play"
              onClick={this.handleSpawn.bind(this)} />,
            <ButtonText value="Quit"
              onClick={this.handleLeaveRoom.bind(this)}
              primary={false} />,
          ]} >
          {deaths === 0 && (
            <p>Click play to start.</p>
          )}
          {deaths > 0 && (
            <p>You died! Try again?</p>
          )}
        </Dialog>
      </div>
    );
  }
}
