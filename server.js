"use strict";

// npm run start-dev

const app = require("./app");
	
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});