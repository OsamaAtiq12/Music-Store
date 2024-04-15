import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Image from "next/image";
import logo from "../../Assets/logo.png";
import background from "../../Assets/background.jpg";

function SpotifyLogin() {
  const router = useRouter();
  const CLIENT_ID = process.env.CLIENT_ID;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  const AUTH_ENDPOINT = process.env.AUTH_ENDPOINT;

  const SCOPES = 'playlist-read-private';
  const AUTH_URL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent(SCOPES)}&response_type=token`;

  const [token, setToken] = useState("");
 const [expiresIn, setExpiresIn] = useState("");
  useEffect(() => {
    if (token) {
      router.push('/home');
    }
  }, [token]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    let expiresIn = window.localStorage.getItem("expires_in");
  
    if (!token && hash) {
      const foundToken = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"));
  
      if (foundToken) {
        token = foundToken.split("=")[1];
        expiresIn = hash
          .substring(1)
          .split("&")
          .find((elem) => elem.startsWith("expires_in"))?.split("=")[1]||"";	
  
        window.location.hash = "";
        window.localStorage.setItem("token", token || ""); // Provide a default value for token
        window.localStorage.setItem("expires_in", expiresIn || ""); // Provide a default value for expiresIn
      }
    }
  
    setToken(token || "");
    setExpiresIn(expiresIn || "");
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  return (
    <div
      className="relative flex justify-center items-center h-screen"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="text-white">
        <header className="App-header items-center flex justify-center flex-col gap-4 ">
          <div className="self-center mt-5">
            <Image width={100} height={100} src={logo} alt="SpotifyLogo" />
          </div>
          <h1 className="font-bold text-[28px]">Sign In</h1>

          {!token ? (
            <a
              className="bg-[#1FDF64] px-3 rounded-[24px] py-2 text-black font-semibold"
              href={AUTH_URL}
            >
              Login to Spotify
            </a>
          ) : (
            <button className="bg-[#1FDF64] px-3 rounded-[24px] py-2 text-black font-semibold" onClick={logout}>Logout</button>
          )}
        </header>
      </div>
      <Image
       className="z-[-1]"
        src={background}
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority
      />
    </div>
  );
}

export default SpotifyLogin;
