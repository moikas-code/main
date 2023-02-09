import {useRouter} from 'next/router';
import styled from 'styled-components';
export const Button = styled.button`
  background-color: #fefefe;
  color: #000;
  border: 1px solid #000;
  padding: 0.5rem;
  border-radius: 5px;
  min-width: 200px;
`;
const links: {label: string; url: string}[] = [
  {
    label: 'Store',
    url: 'https://moikaslookout.etsy.com',
  },
  {
    label: 'Github',
    url: 'https://github.com/moikapy',
  },
  {
    label: 'Twitter',
    url: 'https://twitter.com/moikaslookout',
  },
  {
    label: 'Discord',
    url: 'https://discord.gg/DnbkrC8',
  },
  {
    label: 'Twitch',
    url: 'https://twitch.tv/moikapy',
  },
  {
    label: 'Youtube',
    url: 'https://youtube.com/moikapy',
  },
  {
    label: 'Instagram',
    url: 'https://instagram.com/moikapy',
  },
];
export default function MoiLinkTree() {
  const router = useRouter();
  return (
    <>
      <style jsx>{`
        .mlt {
          max-width: 800px;
          // background:#000;
        }
      `}</style>
      <div className='mlt d-flex flex-column align-items-center'>
        <h1 className=''>Welcome to Moika's Lookout!!</h1>
        <p className='text-capitalize'>
          A Simple Link Tree To Take you to all of our official links
        </p>
        {links.map((link) => {
          return (
            <div className='m-2'>
              <Button
                onClick={() => {
                  router.push(link?.url);
                }}>
                {link?.label}
              </Button>
            </div>
          );
        })}
      </div>
    </>
  );
}
