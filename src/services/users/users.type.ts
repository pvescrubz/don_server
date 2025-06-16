
export interface IAuthSteamData {
    email?: string
    name?: string
    steamAvatar?: string
    system?: boolean
    steamId: string
    ref?: string
}
export interface ISystemAuthData {
    systemLogin: string
    systemPassword: string
}

export interface ISteamUser {
  steamid: string; 
  personaname: string; 

  avatar?: string;
  communityvisibilitystate?: number;
  profilestate?: number;
  profileurl?: string;
  avatarmedium?: string;
  avatarfull?: string;
  avatarhash?: string;
  lastlogoff?: number;
  personastate?: number;
  primaryclanid?: string;
  timecreated?: number;
  personastateflags?: number;
};