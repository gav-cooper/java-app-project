CREATE TABLE IF NOT EXISTS Users (
    userID TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    pfpPath TEXT DEFAULT "/pfp/pfp.png",
    admin INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Preferences (
    userID TEXT PRIMARY KEY,
    genre TEXT,
    FOREIGN KEY(userID) REFERENCES Users(userID)
);

CREATE TABLE IF NOT EXISTS Creates (
    userID TEXT,
    musicID TEXT,
    PRIMARY KEY(userID, musicID),
    FOREIGN KEY(userID) REFERENCES Music(musicID)
);

CREATE TABLE IF NOT EXISTS Music (
    musicID TEXT PRIMARY KEY,
    artist TEXT,
    date INT NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0 CHECK (likes >= 0),
    genre TEXT
);

CREATE TABLE IF NOT EXISTS Comments (
    commentID TEXT PRIMARY KEY,
    userID TEXT,
    message TEXT,
    date INT NOT NULL,
    FOREIGN KEY(userID) REFERENCES Users(userID)
);

CREATE TABLE IF NOT EXISTS MusicLikes (
    userID TEXT,
    musicID TEXT,
    PRIMARY KEY(userID, musicID),
    FOREIGN KEY(userID) REFERENCES Users(userID),
    FOREIGN KEY(musicID) REFERENCES Music(musicID)
);

CREATE TABLE IF NOT EXISTS CommentsLikes (
    userID TEXT,
    musicID TEXT,
    PRIMARY KEY(userID, musicID),
    FOREIGN KEY(userID) REFERENCES Users(userID),
    FOREIGN KEY(musicID) REFERENCES Music(musicID)
);