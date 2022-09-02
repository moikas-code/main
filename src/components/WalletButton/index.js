import Button from '../common/Button';
import {truncateAddress} from '../../../dabu/helpers/truncateAddress';
function WalletButton({address, onPress, onLogin}) {
  return (
    <div
      className={`d-flex flex-row align-items-center position-relative  wallet-button`}>
      <style jsx>
        {`
          .wallet-button {
            width: 150px;
            background-color: #fff;
          }
        `}
      </style>
      {typeof address == 'string' && address.length > 0 ? (
        <Button
          className={`wallet-button-address  px-3 border-none`}
          onClick={() => {
            onPress();
          }}>
          {truncateAddress(address)}
        </Button>
      ) : (
        <Button
          className={`wallet-button-address  px-3 border-none`}
          onClick={() => onLogin()}>
          CONNECT
        </Button>
      )}
    </div>
  );
}
export default WalletButton;
