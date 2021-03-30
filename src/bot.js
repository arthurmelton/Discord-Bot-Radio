require("dotenv").config();
var request = require("request");
const ytdl = require('ytdl-core');
const { Client } = require('discord.js');
const client = new Client();
const PREFIX = "!R";

client.on('ready', () => {
console.log(`${client.user.tag} bot is on`);
	client.user.setActivity(`${PREFIX}help`, {
		type: 'WATCHING'
	})
		.then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
		.catch(console.error);
})

client.on("message", (message) => {
	if (message.author.bot === true) return;
	if (!message.content.startsWith(PREFIX)) return;
	console.log(`[${message.author.tag}]: ${message.content}`);
	const [commandName, ...args] = message.content
		.trim()
		.substring(PREFIX.length)
		.split(/\s+/);
	if (commandName == "play") {
		if (!args[0]) {message.reply(`Please add what type this is (${PREFIX}help play)`); return;}
		const { voice } = message.member;
		if (!voice.channel) {
			message.reply("You have to be in a voice channel");
			return;
		}
		const options = {seek: 0, volume: 1};
		voice.channel.join().then(connection => {
			if (args[0] === "link") {
				const stream = args[1];
				const dispatcher = connection.play(stream, options);
			}else if (args[0] === "youtube") {
				const stream = ytdl(args[1], { filter : 'audioonly' });
				const dispatcher = connection.play(stream, options);
			}else if (args[0] === "radioway") {
				
			}else {
				message.reply(`I do not know what type this is please add a type that I know (${PREFIX}help play)`);
				voice.channel.leave();
				return;
			}
			client.on('voiceStateUpdate', (oldMember, newMember) => {
				if (oldMember.serverDeaf !== null) {
					if (oldMember.serverDeaf === newMember.serverDeaf && oldMember.serverMute === newMember.serverMute && oldMember.selfDeaf == newMember.selfDeaf && oldMember.selfMute === newMember.selfMute && oldMember.selfVideo === newMember.selfVideo && oldMember.streaming === newMember.streaming) {} else {
						return
					}
				}
				if (oldMember.guild.channels.cache.get(oldMember.channelID)) {
					if (oldMember.guild.channels.cache.get(oldMember.channelID).members.size === 1) {
						oldMember.guild.channels.cache.get(oldMember.channelID).leave();
						return;
					}
				}
			})
			client.on("message", (message) => {
				if (message.author.bot === true) return;
				if (!message.content.startsWith(PREFIX)) return;
				console.log(`${voice.channel}, ${message.member.voice.channel}`);
				if (voice.channel !== message.member.voice.channel) return;
				if (message.content === `${PREFIX}stop`) {
					voice.channel.leave();
					return;
				}
			})
		})
	}
	if (commandName === "help") {
		if (args[0] === "play") {
			message.reply(`\n==:Play Help:==\nlink - listen to a radio from a stream link\nyoutue - play youtube video`);
		}else if (!args[0]) {
			message.reply(`\n==:Help:==\n${PREFIX}play {any of ${PREFIX}help play} {link} - listen to a radio\n${PREFIX}help - shows this\n${PREFIX}stop - stops playing`);
		}
	}
})

async function getSong (argument) {
	let stream = await search.search(argument, { type: "video"});
	return stream;
}

client.login(process.env.DISCORD_BOT_TOKEN);