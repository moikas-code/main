import React, {useEffect} from 'react';

const EMBED_URL = 'https://embed.twitch.tv/embed/v1.js';

export default function TwitchEmbed(props: any): React.ReactElement | null {
  useEffect(() => {
    let embed:any;
    if (window) {
      const script = document.createElement('script');
      script.setAttribute('src', EMBED_URL);
      script.addEventListener('load', () => {
        embed = new window.Twitch.Embed(props.targetID, {...props});
      });
      document.body.appendChild(script);
    }
    return () => {
      embed.destroy();
    }
  }, []);
  return (
    <div className='d-none d-md-flex'>
      <div id={props.targetID}></div>
    </div>
  );
}
TwitchEmbed.defaultProps = {
  targetID: 'twitch-embed',
  width: '325',
  height: '250',
  channel: 'moikapy',
  layout: 'video',
};
