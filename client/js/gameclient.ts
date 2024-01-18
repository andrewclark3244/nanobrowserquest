import * as Sentry from "@sentry/browser";
import CryptoJS from "crypto-js";
import * as _ from "lodash";
import { io } from "socket.io-client";

import { Types } from "../../shared/js/gametypes";
import CustomParser from "../../shared/js/parser";
import EntityFactory from "./entityfactory";

import type { Socket } from "socket.io-client";

class GameClient {
  connection: Socket;
  host: any;
  port: any;
  dispatched_callback: any;
  connected_callback: any;
  spawn_callback: any;
  movement_callback: any;
  fail_callback: any;
  notify_callback: any;
  handlers: any;
  isListening?: boolean;
  isTimeout?: boolean;
  disconnected_callback: any;
  welcome_callback: any;
  account_callback: any;
  move_callback: any;
  lootmove_callback: any;
  attack_callback: any;
  raise_callback: any;
  unraise_callback: any;
  spawn_item_callback: any;
  spawn_chest_callback: any;
  spawn_character_callback: any;
  spawn_spell_callback: any;
  despawn_callback: any;
  health_callback: any;
  healthentity_callback: any;
  chat_callback: any;
  equip_callback: any;
  auras_callback: any;
  skill_callback: any;
  curse_callback: any;
  drop_callback: any;
  teleport_callback: any;
  dmg_callback: any;
  population_callback: any;
  kill_callback: any;
  list_callback: any;
  destroy_callback: any;
  stats_callback: any;
  setbonus_callback: any;
  blink_callback: any;
  pvp_callback: any;
  bosscheck_callback: any;
  deathangelcheck_callback: any;
  stoneteleportcheck_callback: any;
  partycreate_callback: any;
  partyjoin_callback: any;
  partyrefuse_callback: any;
  partyinvite_callback: any;
  partydeleteinvite_callback: any;
  partyleave_callback: any;
  partydisband_callback: any;
  partyinfo_callback: any;
  partyerror_callback: any;
  partyloot_callback: any;
  partyhealth_callback: any;
  soulstone_callback: any;
  traderequestsend_callback: any;
  traderequestreceive_callback: any;
  tradestart_callback: any;
  tradeclose_callback: any;
  tradeinfo_callback: any;
  tradeerror_callback: any;
  tradeplayer1moveitem_callback: any;
  tradeplayer2moveitem_callback: any;
  tradeplayer1status_callback: any;
  tradeplayer2status_callback: any;
  receivenotification_callback: any;
  receiveinventory_callback: any;
  receivemerchantsell_callback: any;
  receivemerchantlog_callback: any;
  receivestash_callback: any;
  receiveupgrade_callback: any;
  receiveanvilupgrade_callback: any;
  receiveanvilrecipe_callback: any;
  receiveanvilodds_callback: any;
  receivestoreitems_callback: any;
  receivepurchasecompleted_callback: any;
  receivepurchaseerror_callback: any;
  receivewaypointsupdate_callback: any;
  receivecowlevelstart_callback: any;
  receivecowlevelend_callback: any;
  receiveminotaurlevelstart_callback: any;
  receiveminotaurlevelend_callback: any;
  receivechalicelevelstart_callback: any;
  receivechalicelevelend_callback: any;
  receivetemplelevelstart_callback: any;
  receivetemplelevelend_callback: any;
  receivestonelevelstart_callback: any;
  receivestonelevelend_callback: any;
  receivegatewaylevelstart_callback: any;
  receivegatewaylevelend_callback: any;
  receivelevelinprogress_callback: any;
  receivefrozen_callback: any;
  receiveslowed_callback: any;
  receivepoisoned_callback: any;
  receivecursed_callback: any;
  receivetaunt_callback: any;
  receivegold_callback: any;
  receivegoldstash_callback: any;
  receivegoldtrade_callback: any;
  receivegoldtrade2_callback: any;
  receivegoldbank_callback: any;
  receivegoldbankwithdraw_callback: any;
  receivecoin_callback: any;
  settings_callback: any;

  constructor(host, port) {
    this.connection = null;
    this.host = host;
    this.port = port;

    this.connected_callback = null;
    this.spawn_callback = null;
    this.movement_callback = null;

    this.fail_callback = null;

    this.notify_callback = null;

    this.handlers = [];
    this.handlers[Types.Messages.WELCOME] = this.receiveWelcome;
    this.handlers[Types.Messages.ACCOUNT] = this.receiveAccount;
    this.handlers[Types.Messages.MOVE] = this.receiveMove;
    this.handlers[Types.Messages.LOOTMOVE] = this.receiveLootMove;
    this.handlers[Types.Messages.ATTACK] = this.receiveAttack;
    this.handlers[Types.Messages.RAISE] = this.receiveRaise;
    this.handlers[Types.Messages.UNRAISE] = this.receiveUnraise;
    this.handlers[Types.Messages.SPAWN] = this.receiveSpawn;
    this.handlers[Types.Messages.DESPAWN] = this.receiveDespawn;
    this.handlers[Types.Messages.HEALTH] = this.receiveHealth;
    this.handlers[Types.Messages.HEALTH_ENTITY] = this.receiveHealthEntity;
    this.handlers[Types.Messages.CHAT] = this.receiveChat;
    this.handlers[Types.Messages.EQUIP] = this.receiveEquipItem;
    this.handlers[Types.Messages.AURAS] = this.receiveAuras;
    this.handlers[Types.Messages.SKILL] = this.receiveSkill;
    this.handlers[Types.Messages.DROP] = this.receiveDrop;
    this.handlers[Types.Messages.TELEPORT] = this.receiveTeleport;
    this.handlers[Types.Messages.DAMAGE] = this.receiveDamage;
    this.handlers[Types.Messages.POPULATION] = this.receivePopulation;
    this.handlers[Types.Messages.LIST] = this.receiveList;
    this.handlers[Types.Messages.DESTROY] = this.receiveDestroy;
    this.handlers[Types.Messages.KILL] = this.receiveKill;
    this.handlers[Types.Messages.STATS] = this.receiveStats;
    this.handlers[Types.Messages.SETBONUS] = this.receiveSetBonus;
    this.handlers[Types.Messages.SETTINGS] = this.receiveSettings;
    this.handlers[Types.Messages.BLINK] = this.receiveBlink;
    this.handlers[Types.Messages.PARTY] = this.receiveParty;
    this.handlers[Types.Messages.SOULSTONE] = this.receiveSoulStone;
    this.handlers[Types.Messages.TRADE] = this.receiveTrade;
    this.handlers[Types.Messages.BOSS_CHECK] = this.receiveBossCheck;
    this.handlers[Types.Messages.DEATHANGEL_CHECK] = this.receiveDeathAngelCheck;
    this.handlers[Types.Messages.STONETELEPORT_CHECK] = this.receiveStoneTeleportCheck;
    this.handlers[Types.Messages.NOTIFICATION] = this.receiveNotification;
    this.handlers[Types.Messages.INVENTORY] = this.receiveInventory;
    this.handlers[Types.Messages.STASH] = this.receiveStash;
    this.handlers[Types.Messages.UPGRADE] = this.receiveUpgrade;
    this.handlers[Types.Messages.ANVIL_UPGRADE] = this.receiveAnvilUpgrade;
    this.handlers[Types.Messages.ANVIL_RECIPE] = this.receiveAnvilRecipe;
    this.handlers[Types.Messages.ANVIL_ODDS] = this.receiveAnvilOdds;
    this.handlers[Types.Messages.STORE_ITEMS] = this.receiveStoreItems;
    this.handlers[Types.Messages.PURCHASE_COMPLETED] = this.receivePurchaseCompleted;
    this.handlers[Types.Messages.PURCHASE_ERROR] = this.receivePurchaseError;
    this.handlers[Types.Messages.WAYPOINTS_UPDATE] = this.receiveWaypointsUpdate;
    this.handlers[Types.Messages.LEVEL_INPROGRESS] = this.receiveLevelInProgress;
    this.handlers[Types.Messages.COWLEVEL_START] = this.receiveCowLevelStart;
    this.handlers[Types.Messages.COWLEVEL_END] = this.receiveCowLevelEnd;
    this.handlers[Types.Messages.MINOTAURLEVEL_START] = this.receiveMinotaurLevelStart;
    this.handlers[Types.Messages.MINOTAURLEVEL_END] = this.receiveMinotaurLevelEnd;
    this.handlers[Types.Messages.CHALICELEVEL_START] = this.receiveChaliceLevelStart;
    this.handlers[Types.Messages.CHALICELEVEL_END] = this.receiveChaliceLevelEnd;
    this.handlers[Types.Messages.TEMPLELEVEL_START] = this.receiveTempleLevelStart;
    this.handlers[Types.Messages.TEMPLELEVEL_END] = this.receiveTempleLevelEnd;
    this.handlers[Types.Messages.STONELEVEL_START] = this.receiveStoneLevelStart;
    this.handlers[Types.Messages.STONELEVEL_END] = this.receiveStoneLevelEnd;
    this.handlers[Types.Messages.GATEWAYLEVEL_START] = this.receiveGatewayLevelStart;
    this.handlers[Types.Messages.GATEWAYLEVEL_END] = this.receiveGatewayLevelEnd;
    this.handlers[Types.Messages.FROZEN] = this.receiveFrozen;
    this.handlers[Types.Messages.SLOWED] = this.receiveSlowed;
    this.handlers[Types.Messages.POISONED] = this.receivePoisoned;
    this.handlers[Types.Messages.CURSED] = this.receiveCursed;
    this.handlers[Types.Messages.TAUNT] = this.receiveTaunt;
    this.handlers[Types.Messages.GOLD.INVENTORY] = this.receiveGold;
    this.handlers[Types.Messages.GOLD.STASH] = this.receiveGoldStash;
    this.handlers[Types.Messages.GOLD.TRADE] = this.receiveGoldTrade;
    this.handlers[Types.Messages.GOLD.TRADE2] = this.receiveGoldTrade2;
    this.handlers[Types.Messages.GOLD.BANK] = this.receiveGoldBank;
    this.handlers[Types.Messages.GOLD.BANK_WITHDRAW] = this.receiveGoldBankWithdraw;
    this.handlers[Types.Messages.MERCHANT.SELL] = this.receiveMerchantSell;
    this.handlers[Types.Messages.MERCHANT.LOG] = this.receiveMerchantLog;
    this.handlers[Types.Messages.COIN] = this.receiveCoin;
    this.enable();
  }

  enable() {
    this.isListening = true;
  }

  disable() {
    this.isListening = false;
  }

  connect(dispatcherMode) {
    var protocol = window.location.hostname === "localhost" ? "ws" : "wss";
    var port = window.location.hostname === "localhost" ? ":8000" : "";
    var url = protocol + "://" + this.host + port + "/";

    console.info("Trying to connect to server : " + url);

    this.connection = null;
    this.connection = io(url, {
      // forceNew: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 3000,
      reconnectionAttempts: 5,
      parser: CustomParser,
    });

    if (dispatcherMode) {
      this.connection.on("message", e => {
        var reply = JSON.parse(e.data);

        if (reply.status === "OK") {
          this.dispatched_callback(reply.host, reply.port);
        } else if (reply.status === "FULL") {
          alert("BrowserQuest is currently at maximum player population. Please retry later.");
        } else {
          alert("Unknown error while connecting to Nano BrowserQuest.");
        }
      });
    } else {
      this.connection.on("connection", () => {
        console.info("Connected to server " + this.host + ":" + this.port);
      });

      this.connection.on("message", e => {
        if (e === "go") {
          if (this.connected_callback) {
            this.connected_callback();
          }
          return;
        }
        if (e === "timeout") {
          this.isTimeout = true;
          return;
        }
        if (typeof e === "string" && e.includes("banned")) {
          try {
            const { admin, player, error, reason, message, ip, until } = JSON.parse(e);

            this.fail_callback?.({ admin, player, error, reason, until, message, ip });
          } catch (err) {}
        }

        if (
          e === "invalidlogin" ||
          e === "userexists" ||
          e === "loggedin" ||
          e === "invalidconnection" ||
          e === "passwordcreate" ||
          e === "passwordlogin" ||
          e === "passwordinvalid" ||
          e === "invalidusername" ||
          e === "invalidusernameCreation"
        ) {
          this.fail_callback?.({ reason: e });
          return;
        }

        if (e === "messagetoplayer") {
          // self.disconnected_callback(
          //   "The connection to Nano BrowserQuest has been lost"
          // );
        }

        this.receiveMessage(e);
      });

      this.connection.on("error", err => {
        console.error(err);
        $("#container").addClass("error");
        this.disconnected_callback?.("The connection to Nano BrowserQuest has been lost");
      });

      this.connection.io.off("reconnect_attempt").on("reconnect_attempt", attempt => {
        console.info(`Reconnect failed, attempt ${attempt}`);

        if (attempt > 5) {
          this.connection.disconnect();
        }
      });

      this.connection.io.on("reconnect", () => {
        // @TODO ~~~ better handle reconnection?
      });

      this.connection.on("disconnect", reason => {
        console.info(`Connection closed, ${reason}`);

        let disconnectMessage = "An error occured";
        if (reason === "transport close") {
          disconnectMessage = "The connection to Nano BrowserQuest has been lost";
        } else if (this.isTimeout) {
          disconnectMessage = "You have been disconnected for being inactive for too long";
        }

        if (disconnectMessage) {
          $("#container").addClass("error");
          this.disconnected_callback?.(disconnectMessage);
          this.connection.disconnect();
        }
      });
    }
  }

  signMessage(message, secret) {
    return this.someHashFunction(message, secret);
  }

  someHashFunction(message, secret) {
    const encodedMsg = CryptoJS.AES.encrypt(JSON.stringify(message), secret).toString();

    return encodedMsg;
  }
  sendMessage(json) {
    if (this.connection.connected === true) {
      const secret = "4c10471-09cb-49e6-a816-7510677926bc";

      const sentmessage = {
        action: json[0],
        message: json[1],
        // clientSignature: signature,
        params: [json[1], json[2], json[3], json[4], json[5]],
      };

      const encryptedMessage = this.signMessage(sentmessage, secret);

      this.connection.send(encryptedMessage);
    }
  }

  receiveMessage(message) {
    if (this.isListening) {
      if (message instanceof Array) {
        if (message[0] instanceof Array) {
          // Multiple actions received
          this.receiveActionBatch(message);
        } else {
          // Only one action received
          this.receiveAction(message);
        }
      } else if (message && message.type) {
        this.receiveAction(message);
      }
    }
  }

  receiveAction(data) {
    var action = data instanceof Array ? data[0] : data.type;

    if (this.handlers[action] && _.isFunction(this.handlers[action])) {
      this.handlers[action].call(this, data);
    } else {
      console.error("Unknown action : " + action);
    }
  }

  receiveActionBatch(actions) {
    var self = this;

    _.each(actions, function (action) {
      self.receiveAction(action);
    });
  }

  receiveWelcome(data) {
    this.welcome_callback?.(data[1]);
  }

  receiveAccount(data) {
    this.account_callback?.(data[1]);
  }

  receiveMove(data) {
    var id = data[1],
      x = data[2],
      y = data[3];

    if (this.move_callback) {
      this.move_callback(id, x, y);
    }
  }

  receiveLootMove(data) {
    var id = data[1],
      item = data[2];

    if (this.lootmove_callback) {
      this.lootmove_callback(id, item);
    }
  }

  receiveAttack(data) {
    var attacker = data[1];
    var target = data[2];

    if (this.attack_callback) {
      this.attack_callback(attacker, target);
    }
  }

  receiveRaise(data) {
    var mobId = data[1];
    var targetId = data[2];

    if (this.raise_callback) {
      this.raise_callback(mobId, targetId);
    }
  }

  receiveUnraise(data) {
    var mobId = data[1];

    if (this.unraise_callback) {
      this.unraise_callback(mobId);
    }
  }

  // receiveSpawnBatch(datas) {
  //   datas.forEach(data => this.receiveSpawn(data));
  // }

  receiveDrop(data) {
    const { mobId, itemId, kind, mobHateList, partyId, amount, skin } = data[1];

    try {
      const item = EntityFactory.createEntity({ kind, id: itemId, skin });

      // @TODO unify this with the receiveSpawn
      item.wasDropped = true;
      item.playersInvolved = mobHateList;
      item.partyId = partyId;
      if ([Types.Entities.GOLD, Types.Entities.NANOCOIN, Types.Entities.BANANOCOIN].includes(item.kind)) {
        item.amount = amount;
      }

      this.drop_callback?.(item, mobId);
    } catch (err) {
      Sentry.captureException(err, { extra: data[1] });
    }
  }

  receiveSpawn(data) {
    const { id, kind, x, y, orientation, isPet } = data[1];

    if (Types.isSpell(kind)) {
      const spell = EntityFactory.createEntity({ kind, id });
      const { originX, originY, element, casterId, targetId, isRaise2 = false } = data[1];

      spell.casterId = casterId;
      spell.targetId = targetId;

      this.spawn_spell_callback?.(spell, x, y, orientation, originX, originY, element, casterId, targetId, isRaise2);
    } else if (Types.isItem(kind) && !isPet) {
      const { mobHateList, partyId, amount, skin } = data[1];

      const item = EntityFactory.createEntity({ kind, id, skin });

      // @TODO unify this with the receiveDrop
      item.wasDropped = false;
      item.playersInvolved = mobHateList;
      item.partyId = partyId;
      if ([Types.Entities.GOLD, Types.Entities.NANOCOIN, Types.Entities.BANANOCOIN].includes(item.kind)) {
        item.amount = amount;
        item.skin = skin;
      }
      this.spawn_item_callback?.(item, x, y);
    } else if (Types.isStaticChest(kind)) {
      var item = EntityFactory.createEntity({ kind, id });

      this.spawn_chest_callback?.(item, x, y);
    } else {
      this.spawn_character_callback?.(data[1]);
    }
  }

  receiveDespawn(data) {
    var id = data[1];
    this.despawn_callback?.(id);
  }

  receiveHealth(data) {
    this.health_callback?.(data[1]);
  }

  receiveHealthEntity(data) {
    this.healthentity_callback?.(data[1]);
  }

  receiveChat(data) {
    var entityId = data[1];
    var name = data[2];
    var message = data[3];
    var type = data[4];
    var deductedGold = data[5];

    if (this.chat_callback) {
      this.chat_callback({ entityId, name, message, type, deductedGold });
    }
  }

  receiveEquipItem(data) {
    var id = data[1];
    var item = data[2];

    this.equip_callback?.({ id, ...item });
  }

  receiveAuras(data) {
    var id = data[1];
    var auras = data[2];

    if (this.auras_callback) {
      this.auras_callback(id, auras);
    }
  }

  receiveSkill(data) {
    var id = data[1];
    var skill = data[2];

    if (this.skill_callback) {
      this.skill_callback({ id, skill });
    }
  }

  receiveTeleport(data) {
    var id = data[1],
      x = data[2],
      y = data[3];

    if (this.teleport_callback) {
      this.teleport_callback(id, x, y);
    }
  }

  receiveDamage(data) {
    var id = data[1];
    var dmg = data[2];
    var hp = parseInt(data[3]);
    var maxHitPoints = parseInt(data[4]);
    var isCritical = data[5];
    var isBlocked = data[6];

    if (this.dmg_callback) {
      this.dmg_callback({ id, dmg, hp, maxHitPoints, isCritical, isBlocked });
    }
  }

  receivePopulation(data) {
    var players = data[1];
    var levelupPlayer = data[2];

    if (this.population_callback) {
      this.population_callback(players, levelupPlayer);
    }
  }

  receiveKill(data) {
    this.kill_callback?.(data[1]);
  }

  receiveList(data) {
    data.shift();

    this.list_callback?.(data);
  }

  receiveDestroy(data) {
    var id = data[1];

    this.destroy_callback?.(id);
  }

  receiveStats(data) {
    const stats = data[1];

    this.stats_callback?.(stats);
  }

  receiveSettings(data) {
    var playerId = data[1];
    var settings = data[2];

    this.settings_callback?.({ playerId, settings });
  }

  receiveSetBonus(data) {
    var bonus = data[1];

    if (this.setbonus_callback) {
      this.setbonus_callback(bonus);
    }
  }

  receiveBlink(data) {
    var id = data[1];

    if (this.blink_callback) {
      this.blink_callback(id);
    }
  }

  receiveParty(data) {
    if (data[1] === Types.Messages.PARTY_ACTIONS.CREATE && this.partycreate_callback) {
      this.partycreate_callback();
    } else if (data[1] === Types.Messages.PARTY_ACTIONS.JOIN && this.partyjoin_callback) {
      this.partyjoin_callback(data[2]);
    } else if (data[1] === Types.Messages.PARTY_ACTIONS.REFUSE && this.partyrefuse_callback) {
      this.partyrefuse_callback(data[2]);
    } else if (data[1] === Types.Messages.PARTY_ACTIONS.INVITE && this.partyinvite_callback) {
      this.partyinvite_callback(data[2]);
    } else if (data[1] === Types.Messages.PARTY_ACTIONS.DELETE_INVITE && this.partydeleteinvite_callback) {
      this.partydeleteinvite_callback(data[2]);
    } else if (data[1] === Types.Messages.PARTY_ACTIONS.LEAVE && this.partyleave_callback) {
      this.partyleave_callback(data[2]);
    } else if (data[1] === Types.Messages.PARTY_ACTIONS.DISBAND && this.partydisband_callback) {
      this.partydisband_callback(data[2]);
    } else if (data[1] === Types.Messages.PARTY_ACTIONS.INFO && this.partyinfo_callback) {
      this.partyinfo_callback(data[2]);
    } else if (data[1] === Types.Messages.PARTY_ACTIONS.ERROR && this.partyerror_callback) {
      this.partyerror_callback(data[2]);
    } else if (data[1] === Types.Messages.PARTY_ACTIONS.LOOT && this.partyloot_callback) {
      this.partyloot_callback(data[2]);
    } else if (data[1] === Types.Messages.PARTY_ACTIONS.HEALTH && this.partyhealth_callback) {
      this.partyhealth_callback(data[2]);
    }
  }

  receiveSoulStone(data) {
    this.soulstone_callback?.(data[1]);
  }

  receiveTrade(data) {
    if (data[1] === Types.Messages.TRADE_ACTIONS.REQUEST_SEND && this.traderequestsend_callback) {
      this.traderequestsend_callback(data[2]);
    } else if (data[1] === Types.Messages.TRADE_ACTIONS.REQUEST_RECEIVE && this.traderequestreceive_callback) {
      this.traderequestreceive_callback(data[2]);
    } else if (data[1] === Types.Messages.TRADE_ACTIONS.START && this.tradestart_callback) {
      this.tradestart_callback(data[2]);
    } else if (data[1] === Types.Messages.TRADE_ACTIONS.CLOSE && this.tradeclose_callback) {
      this.tradeclose_callback(data[2]);
    } else if (data[1] === Types.Messages.TRADE_ACTIONS.INFO && this.tradeinfo_callback) {
      this.tradeinfo_callback(data[2]);
    } else if (data[1] === Types.Messages.TRADE_ACTIONS.ERROR && this.tradeerror_callback) {
      this.tradeerror_callback(data[2]);
    } else if (data[1] === Types.Messages.TRADE_ACTIONS.PLAYER1_MOVE_ITEM && this.tradeplayer1moveitem_callback) {
      this.tradeplayer1moveitem_callback(data[2]);
    } else if (data[1] === Types.Messages.TRADE_ACTIONS.PLAYER2_MOVE_ITEM && this.tradeplayer2moveitem_callback) {
      this.tradeplayer2moveitem_callback(data[2]);
    } else if (data[1] === Types.Messages.TRADE_ACTIONS.PLAYER1_STATUS && this.tradeplayer1status_callback) {
      this.tradeplayer1status_callback(data[2]);
    } else if (data[1] === Types.Messages.TRADE_ACTIONS.PLAYER2_STATUS && this.tradeplayer2status_callback) {
      this.tradeplayer2status_callback(data[2]);
    }
  }

  receiveBossCheck(data) {
    this.bosscheck_callback?.(data);
  }

  receiveDeathAngelCheck(data) {
    const coords = data[1];
    this.deathangelcheck_callback?.(coords);
  }

  receiveStoneTeleportCheck(data) {
    const params = data[1];
    this.stoneteleportcheck_callback?.(params);
  }

  receiveNotification(data) {
    this.receivenotification_callback?.(data);
  }

  receiveInventory(data) {
    var inventory = data[1];
    this.receiveinventory_callback?.(inventory);
  }

  receiveMerchantSell() {
    this.receivemerchantsell_callback?.();
  }

  receiveMerchantLog(data) {
    const log = data[1];
    this.receivemerchantlog_callback?.(log);
  }

  receiveStash(data) {
    var stash = data[1];
    this.receivestash_callback?.(stash);
  }

  receiveUpgrade(data) {
    var upgrade = data[1];
    const { luckySlot, isLucky7, isMagic8, isSuccess, recipe } = data[2] || {};

    if (this.receiveupgrade_callback) {
      this.receiveupgrade_callback(upgrade, { luckySlot, isLucky7, isMagic8, isSuccess, recipe });
    }
  }

  receiveAnvilUpgrade(data) {
    const {
      isSuccess,
      isTransmute,
      isRuneword,
      isChestblue,
      isChestgreen,
      isChestpurple,
      isChristmasPresent,
      isChestdead,
      isChestred,
    } = data[1];

    if (this.receiveanvilupgrade_callback) {
      this.receiveanvilupgrade_callback({
        isSuccess,
        isTransmute,
        isRuneword,
        isChestblue,
        isChestgreen,
        isChestpurple,
        isChristmasPresent,
        isChestdead,
        isChestred,
      });
    }
  }

  receiveAnvilRecipe(data) {
    var recipe = data[1];

    if (this.receiveanvilrecipe_callback) {
      this.receiveanvilrecipe_callback(recipe);
    }
  }

  receiveAnvilOdds(data) {
    const message = data[1];

    if (this.receiveanvilodds_callback) {
      this.receiveanvilodds_callback(message);
    }
  }

  receiveStoreItems(data) {
    const items = data[1];

    this.receivestoreitems_callback?.(items);
  }

  receivePurchaseCompleted(data) {
    const payment = data[1];

    this.receivepurchasecompleted_callback?.(payment);
  }

  receivePurchaseError(data) {
    const error = data[1];

    this.receivepurchaseerror_callback?.(error);
  }

  receiveWaypointsUpdate(data) {
    const waypoints = data[1];

    this.receivewaypointsupdate_callback?.(waypoints);
  }

  receiveCowLevelStart(data) {
    const x = data[1];
    const y = data[2];
    this.receivecowlevelstart_callback?.({ x, y });
  }

  receiveCowLevelEnd(data) {
    const isCompleted = data[1];
    this.receivecowlevelend_callback?.(isCompleted);
  }

  receiveMinotaurLevelStart() {
    this.receiveminotaurlevelstart_callback?.();
  }

  receiveMinotaurLevelEnd() {
    this.receiveminotaurlevelend_callback?.();
  }

  receiveChaliceLevelStart() {
    this.receivechalicelevelstart_callback?.();
  }

  receiveChaliceLevelEnd(data) {
    const isCompleted = data[1];
    this.receivechalicelevelend_callback?.(isCompleted);
  }

  receiveTempleLevelStart() {
    this.receivetemplelevelstart_callback?.();
  }

  receiveTempleLevelEnd() {
    this.receivetemplelevelend_callback?.();
  }

  receiveStoneLevelStart() {
    this.receivestonelevelstart_callback?.();
  }

  receiveStoneLevelEnd() {
    this.receivestonelevelend_callback?.();
  }

  receiveGatewayLevelStart() {
    this.receivegatewaylevelstart_callback?.();
  }

  receiveGatewayLevelEnd() {
    this.receivegatewaylevelend_callback?.();
  }

  receiveLevelInProgress(data) {
    const clock = data[1];
    const level = data[2];
    this.receivelevelinprogress_callback(clock, level);
  }

  receiveFrozen(data) {
    const entityId = data[1];
    const duration = data[2];

    this.receivefrozen_callback?.(entityId, duration);
  }

  receiveSlowed(data) {
    const entityId = data[1];
    const duration = data[2];

    this.receiveslowed_callback?.(entityId, duration);
  }

  receivePoisoned(data) {
    const entityId = data[1];
    const duration = data[2];

    this.receivepoisoned_callback?.(entityId, duration);
  }

  receiveCursed(data) {
    const entityId = data[1];
    const curseId = data[2];
    const duration = data[3];

    this.receivecursed_callback?.(entityId, curseId, duration);
  }

  receiveTaunt(data) {
    const entityId = data[1];

    this.receivetaunt_callback?.(entityId);
  }

  receiveGold(data) {
    this.receivegold_callback?.(data[1]);
  }

  receiveGoldStash(data) {
    this.receivegoldstash_callback?.(data[1]);
  }

  receiveGoldTrade(data) {
    this.receivegoldtrade_callback?.(data[1]);
  }

  receiveGoldTrade2(data) {
    this.receivegoldtrade2_callback?.(data[1]);
  }

  receiveGoldBank(data) {
    this.receivegoldbank_callback?.(data[1]);
  }

  receiveGoldBankWithdraw(data) {
    this.receivegoldbankwithdraw_callback?.(data[1]);
  }

  receiveCoin(data) {
    this.receivecoin_callback?.(data[1]);
  }

  onDispatched(callback) {
    this.dispatched_callback = callback;
  }

  onConnected(callback) {
    this.connected_callback = callback;
  }

  onDisconnected(callback) {
    this.disconnected_callback = callback;
  }

  onWelcome(callback) {
    this.welcome_callback = callback;
  }

  onAccount(callback) {
    this.account_callback = callback;
  }

  onSpawnCharacter(callback) {
    this.spawn_character_callback = callback;
  }

  onSpawnSpell(callback) {
    this.spawn_spell_callback = callback;
  }

  onSpawnItem(callback) {
    this.spawn_item_callback = callback;
  }

  onSpawnChest(callback) {
    this.spawn_chest_callback = callback;
  }

  onDespawnEntity(callback) {
    this.despawn_callback = callback;
  }

  onEntityMove(callback) {
    this.move_callback = callback;
  }

  onEntityAttack(callback) {
    this.attack_callback = callback;
  }

  onEntityRaise(callback) {
    this.raise_callback = callback;
  }

  onEntityUnraise(callback) {
    this.unraise_callback = callback;
  }

  onPlayerChangeHealth(callback) {
    this.health_callback = callback;
  }

  onEntityChangeHealth(callback) {
    this.healthentity_callback = callback;
  }

  onPlayerEquipItem(callback) {
    this.equip_callback = callback;
  }

  onPlayerAuras(callback) {
    this.auras_callback = callback;
  }

  onPlayerSkill(callback) {
    this.skill_callback = callback;
  }

  onPlayerCurse(callback) {
    this.curse_callback = callback;
  }

  onPlayerMoveToItem(callback) {
    this.lootmove_callback = callback;
  }

  onPlayerTeleport(callback) {
    this.teleport_callback = callback;
  }

  onChatMessage(callback) {
    this.chat_callback = callback;
  }

  onDropItem(callback) {
    this.drop_callback = callback;
  }

  onPlayerDamageMob(callback) {
    this.dmg_callback = callback;
  }

  onPlayerKillMob(callback) {
    this.kill_callback = callback;
  }

  onPopulationChange(callback) {
    this.population_callback = callback;
  }

  onEntityList(callback) {
    this.list_callback = callback;
  }

  onEntityDestroy(callback) {
    this.destroy_callback = callback;
  }

  onPlayerChangeStats(callback) {
    this.stats_callback = callback;
  }

  onPlayerSettings(callback) {
    this.settings_callback = callback;
  }

  onSetBonus(callback) {
    this.setbonus_callback = callback;
  }

  onItemBlink(callback) {
    this.blink_callback = callback;
  }

  onPartyCreate(callback) {
    this.partycreate_callback = callback;
  }

  onPartyJoin(callback) {
    this.partyjoin_callback = callback;
  }

  onPartyRefuse(callback) {
    this.partyrefuse_callback = callback;
  }

  onPartyInvite(callback) {
    this.partyinvite_callback = callback;
  }

  onPartyDeleteInvite(callback) {
    this.partydeleteinvite_callback = callback;
  }

  onPartyLeave(callback) {
    this.partyleave_callback = callback;
  }

  onPartyDisband(callback) {
    this.partydisband_callback = callback;
  }

  onPartyInfo(callback) {
    this.partyinfo_callback = callback;
  }

  onPartyError(callback) {
    this.partyerror_callback = callback;
  }

  onPartyLoot(callback) {
    this.partyloot_callback = callback;
  }

  onPartyHealth(callback) {
    this.partyhealth_callback = callback;
  }

  onSoulStone(callback) {
    this.soulstone_callback = callback;
  }

  onTradeRequestSend(callback) {
    this.traderequestsend_callback = callback;
  }

  onTradeRequestReceive(callback) {
    this.traderequestreceive_callback = callback;
  }

  onTradeStart(callback) {
    this.tradestart_callback = callback;
  }

  onTradeClose(callback) {
    this.tradeclose_callback = callback;
  }

  onTradeInfo(callback) {
    this.tradeinfo_callback = callback;
  }

  onTradeError(callback) {
    this.tradeerror_callback = callback;
  }

  onPlayer1MoveItem(callback) {
    this.tradeplayer1moveitem_callback = callback;
  }

  onPlayer2MoveItem(callback) {
    this.tradeplayer2moveitem_callback = callback;
  }

  onPlayer1Status(callback) {
    this.tradeplayer1status_callback = callback;
  }

  onPlayer2Status(callback) {
    this.tradeplayer2status_callback = callback;
  }

  onBossCheck(callback) {
    this.bosscheck_callback = callback;
  }

  onDeathAngelCheck(callback) {
    this.deathangelcheck_callback = callback;
  }

  onStoneTeleportCheck(callback) {
    this.stoneteleportcheck_callback = callback;
  }

  onReceiveNotification(callback) {
    this.receivenotification_callback = callback;
  }

  onReceiveInventory(callback) {
    this.receiveinventory_callback = callback;
  }

  onReceiveMerchantSell(callback) {
    this.receivemerchantsell_callback = callback;
  }

  onReceiveMerchantLog(callback) {
    this.receivemerchantlog_callback = callback;
  }

  onReceiveStash(callback) {
    this.receivestash_callback = callback;
  }

  onReceiveUpgrade(callback) {
    this.receiveupgrade_callback = callback;
  }

  onReceiveAnvilUpgrade(callback) {
    this.receiveanvilupgrade_callback = callback;
  }

  onReceiveAnvilRecipe(callback) {
    this.receiveanvilrecipe_callback = callback;
  }

  onReceiveAnvilOdds(callback) {
    this.receiveanvilodds_callback = callback;
  }

  onReceiveStoreItems(callback) {
    this.receivestoreitems_callback = callback;
  }

  onReceivePurchaseCompleted(callback) {
    this.receivepurchasecompleted_callback = callback;
  }

  onReceivePurchaseError(callback) {
    this.receivepurchaseerror_callback = callback;
  }

  onReceiveWaypointsUpdate(callback) {
    this.receivewaypointsupdate_callback = callback;
  }

  onReceiveCowLevelStart(callback) {
    this.receivecowlevelstart_callback = callback;
  }

  onReceiveCowLevelEnd(callback) {
    this.receivecowlevelend_callback = callback;
  }

  onReceiveMinotaurLevelStart(callback) {
    this.receiveminotaurlevelstart_callback = callback;
  }

  onReceiveMinotaurLevelEnd(callback) {
    this.receiveminotaurlevelend_callback = callback;
  }

  onReceiveChaliceLevelStart(callback) {
    this.receivechalicelevelstart_callback = callback;
  }

  onReceiveChaliceLevelEnd(callback) {
    this.receivechalicelevelend_callback = callback;
  }

  onReceiveTempleLevelStart(callback) {
    this.receivetemplelevelstart_callback = callback;
  }

  onReceiveTempleLevelEnd(callback) {
    this.receivetemplelevelend_callback = callback;
  }

  onReceiveStoneLevelStart(callback) {
    this.receivestonelevelstart_callback = callback;
  }

  onReceiveStoneLevelEnd(callback) {
    this.receivestonelevelend_callback = callback;
  }

  onReceiveGatewayLevelStart(callback) {
    this.receivegatewaylevelstart_callback = callback;
  }

  onReceiveGatewayLevelEnd(callback) {
    this.receivegatewaylevelend_callback = callback;
  }

  onReceiveLevelInProgress(callback) {
    this.receivelevelinprogress_callback = callback;
  }

  onFrozen(callback) {
    this.receivefrozen_callback = callback;
  }

  onSlowed(callback) {
    this.receiveslowed_callback = callback;
  }

  onPoisoned(callback) {
    this.receivepoisoned_callback = callback;
  }

  onCursed(callback) {
    this.receivecursed_callback = callback;
  }

  onTaunt(callback) {
    this.receivetaunt_callback = callback;
  }

  onReceiveGold(callback) {
    this.receivegold_callback = callback;
  }

  onReceiveGoldStash(callback) {
    this.receivegoldstash_callback = callback;
  }

  onReceiveGoldTrade(callback) {
    this.receivegoldtrade_callback = callback;
  }

  onReceiveGoldTrade2(callback) {
    this.receivegoldtrade2_callback = callback;
  }

  onReceiveGoldBank(callback) {
    this.receivegoldbank_callback = callback;
  }

  onReceiveGoldBankWithdraw(callback) {
    this.receivegoldbankwithdraw_callback = callback;
  }

  onReceiveCoin(callback) {
    this.receivecoin_callback = callback;
  }

  sendCreate({ name, account = "", password = "" }) {
    this.sendMessage([Types.Messages.CREATE, name, account, password]);
  }

  sendLogin({ name, account = "", password = "" }) {
    this.sendMessage([Types.Messages.LOGIN, name, account, password]);
  }

  sendAccount(account) {
    this.sendMessage([Types.Messages.ACCOUNT, account]);
  }

  sendMove(x, y) {
    this.sendMessage([Types.Messages.MOVE, x, y]);
  }

  sendMovePet(x, y) {
    this.sendMessage([Types.Messages.MOVE_PET, x, y]);
  }

  sendLootMove(item, x, y) {
    this.sendMessage([Types.Messages.LOOTMOVE, x, y, item.id]);
  }

  sendAggro(mob) {
    this.sendMessage([Types.Messages.AGGRO, mob.id]);
  }

  sendAttack(mob) {
    this.sendMessage([Types.Messages.ATTACK, mob.id]);
  }

  sendHit(mob) {
    this.sendMessage([Types.Messages.HIT, mob.id]);
  }

  sendHurt(mob) {
    this.sendMessage([Types.Messages.HURT, mob.id]);
  }

  sendHurtSpell(spell) {
    this.sendMessage([Types.Messages.HURT_SPELL, spell.id]);
  }

  sendHurtTrap(trap) {
    this.sendMessage([Types.Messages.HURT_TRAP, trap.id]);
  }

  sendChat(text) {
    this.sendMessage([Types.Messages.CHAT, text]);
  }

  sendLoot(item) {
    this.sendMessage([Types.Messages.LOOT, item.id]);
  }

  sendTeleport(x, y, orientation) {
    this.sendMessage([Types.Messages.TELEPORT, x, y, orientation]);
  }

  sendStoneTeleport(playerId) {
    this.sendMessage([Types.Messages.STONETELEPORT, playerId]);
  }

  sendZone() {
    this.sendMessage([Types.Messages.ZONE]);
  }

  sendOpen(chest) {
    this.sendMessage([Types.Messages.OPEN, chest.id]);
  }

  sendCheck(id) {
    this.sendMessage([Types.Messages.CHECK, id]);
  }

  sendCheckStorage() {
    this.sendMessage([Types.Messages.CHECK_STORAGE]);
  }

  sendWho(ids) {
    this.sendMessage([Types.Messages.WHO, [...ids]]);
  }

  sendAchievement(id) {
    this.sendMessage([Types.Messages.ACHIEVEMENT, id, "found"]);
  }

  sendWaypoint(id) {
    this.sendMessage([Types.Messages.WAYPOINT, id, "found"]);
  }

  sendBossCheck(again) {
    this.sendMessage([Types.Messages.BOSS_CHECK, again]);
  }

  sendPartyCreate() {
    this.sendMessage([Types.Messages.PARTY, Types.Messages.PARTY_ACTIONS.CREATE]);
  }

  sendPartyJoin(partyId) {
    this.sendMessage([Types.Messages.PARTY, Types.Messages.PARTY_ACTIONS.JOIN, partyId]);
  }

  sendPartyRefuse(partyId) {
    this.sendMessage([Types.Messages.PARTY, Types.Messages.PARTY_ACTIONS.REFUSE, partyId]);
  }

  sendPartyInvite(playerName) {
    this.sendMessage([Types.Messages.PARTY, Types.Messages.PARTY_ACTIONS.INVITE, playerName]);
  }

  sendPartyLeave() {
    this.sendMessage([Types.Messages.PARTY, Types.Messages.PARTY_ACTIONS.LEAVE]);
  }

  sendPartyRemove(playerName) {
    this.sendMessage([Types.Messages.PARTY, Types.Messages.PARTY_ACTIONS.REMOVE, playerName]);
  }

  sendPartyDisband() {
    this.sendMessage([Types.Messages.PARTY, Types.Messages.PARTY_ACTIONS.DISBAND]);
  }

  sendTradeRequest(playerName) {
    this.sendMessage([Types.Messages.TRADE, Types.Messages.TRADE_ACTIONS.REQUEST_SEND, playerName]);
  }

  sendTradeRequestAccept(playerName) {
    this.sendMessage([Types.Messages.TRADE, Types.Messages.TRADE_ACTIONS.REQUEST_ACCEPT, playerName]);
  }

  sendTradeRequestRefuse(playerName) {
    this.sendMessage([Types.Messages.TRADE, Types.Messages.TRADE_ACTIONS.REQUEST_REFUSE, playerName]);
  }

  sendTradeClose() {
    this.sendMessage([Types.Messages.TRADE, Types.Messages.TRADE_ACTIONS.CLOSE]);
  }

  sendTradePlayer1Status(isAccepted) {
    this.sendMessage([Types.Messages.TRADE, Types.Messages.TRADE_ACTIONS.PLAYER1_STATUS, isAccepted]);
  }

  sendBanPlayer(message) {
    this.sendMessage([Types.Messages.BAN_PLAYER, message]);
  }

  sendManualBanPlayer(params) {
    this.sendMessage([Types.Messages.MANUAL_BAN_PLAYER, params]);
  }

  sendRequestPayout(kind) {
    this.sendMessage([Types.Messages.REQUEST_PAYOUT, kind]);
  }

  sendMoveItem(fromSlot, toSlot, quantity) {
    this.sendMessage([Types.Messages.MOVE_ITEM, fromSlot, toSlot, quantity]);
  }

  sendMoveItemsToInventory(panel) {
    this.sendMessage([Types.Messages.MOVE_ITEMS_TO_INVENTORY, panel]);
  }

  sendUpgradeItem() {
    this.sendMessage([Types.Messages.UPGRADE_ITEM]);
  }

  sendStoreItems() {
    this.sendMessage([Types.Messages.STORE_ITEMS]);
  }

  sendPurchaseCreate(id, account) {
    this.sendMessage([Types.Messages.PURCHASE_CREATE, id, account]);
  }

  sendPurchaseCancel() {
    this.sendMessage([Types.Messages.PURCHASE_CANCEL]);
  }

  sendSettings(settings) {
    this.sendMessage([Types.Messages.SETTINGS, settings]);
  }

  sendSkill(slot, mobId) {
    this.sendMessage([Types.Messages.SKILL, slot, mobId]);
  }

  sendCastSpell(mobId, x, y, targetId = 0, isRaise2 = false) {
    this.sendMessage([Types.Messages.CAST_SPELL, mobId, x, y, targetId, isRaise2]);
  }

  sendMagicStone(id) {
    this.sendMessage([Types.Messages.MAGICSTONE, id]);
  }

  sendLever(id) {
    this.sendMessage([Types.Messages.LEVER, id]);
  }

  sendAltarChalice(id) {
    this.sendMessage([Types.Messages.ALTARCHALICE, id]);
  }

  sendAltarSoulStone(id) {
    this.sendMessage([Types.Messages.ALTARSOULSTONE, id]);
  }

  sendFossil() {
    this.sendMessage([Types.Messages.FOSSIL]);
  }

  sendHands(id) {
    this.sendMessage([Types.Messages.HANDS, id]);
  }

  sendActivateTrap(id) {
    this.sendMessage([Types.Messages.TRAP, id]);
  }

  sendActivateStatue(id) {
    this.sendMessage([Types.Messages.STATUE, id]);
  }

  sendMoveGold(amount, from, to) {
    this.sendMessage([Types.Messages.GOLD.MOVE, amount, from, to]);
  }

  sendGoldBank(isIouExchange = false) {
    this.sendMessage([Types.Messages.GOLD.BANK, isIouExchange]);
  }

  sendBuyFromMerchant(fromSlot, toSlot, quantity) {
    this.sendMessage([Types.Messages.MERCHANT.BUY, fromSlot, toSlot, quantity]);
  }

  sendSellToMerchant(fromSlot, quantity) {
    this.sendMessage([Types.Messages.MERCHANT.SELL, fromSlot, quantity]);
  }

  sendHash(hash: string) {
    this.sendMessage([Types.Messages.HASH, hash]);
  }
  sendBan(params) {
    this.sendMessage([Types.Messages.BAN, params]);
  }
}

export default GameClient;
