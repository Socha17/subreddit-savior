import './createPost.tsx';
import { Devvit, useState } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
  redis: true,
});

Devvit.addCustomPostType({
  name: 'Subreddit Savior Game',
  height: 'tall',
  render: (context) => {
    // Load username with `useState` hook
    const [username] = useState(async () => {
      const currUser = await context.reddit.getCurrentUser();
      return currUser?.username ?? 'anon';
    });

    const [webviewVisible, setWebviewVisible] = useState(false);

    const onShowWebviewClick = () => {
      setWebviewVisible(true);

      context.ui.webView.postMessage('myWebView', {
        type: 'initialData',
        data: {
          username: username,
        },
      });
    };

    return (
      <zstack
        grow
        padding="none"
        height="100%"
        width="100%"
      >
        {/* Background Image Layer */}
        <image
          url="bg.png" // Path to background image
          width="100%"
          height="100%"
          resizeMode="fill"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0, // Background at the lowest layer
          }}
          description="Background Image"
        />

        {/* Foreground Content */}
        {!webviewVisible && (
          <vstack
            grow
            alignment="middle center"
            width="100%"
            height="100%"
            style={{
              zIndex: 1, // Content layer above the background
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
                        <image
              url="hero.png" // Path to hero image
              width="120px" // Adjust width as needed
              height="120px"
              style={{
                marginBottom: '20px', // Space between the hero and title
              }}
              description="Hero Image"
            />
            <text
              size="xxlarge"
              weight="bold"
              color="#fff"
              alignment="center middle"
            >
              Subreddit Savior
            </text>
            <spacer size="small" />
            <text
              size="large"
              weight="bold"
              color="#fff"
              alignment="center middle"
            >
              Save the subreddit by finding all the matching tools!
            </text>
            <spacer size="large" />
            <button
              onPress={onShowWebviewClick}
              style={{
                backgroundColor: '#407A6B',
                color: '#FFFFFF',
                padding: '15px 30px',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Start Game
            </button>
          </vstack>
        )}

        {/* WebView Container */}
        {webviewVisible && (
          <webview
            id="myWebView"
            url="page.html"
            onMessage={(msg) => console.log(msg)}
            height="100%"
            width="100%"
            grow
            style={{
              zIndex: 2, // WebView layer above everything
            }}
          />
        )}
      </zstack>
    );
  },
});

export default Devvit;
