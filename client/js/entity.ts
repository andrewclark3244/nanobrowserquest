import { Types } from "../../shared/js/gametypes";

class Entity {
  id: any;
  kind: any;
  sprite: any;
  flipSpriteX: boolean;
  flipSpriteY: boolean;
  animations: any;
  currentAnimation: any;
  shadowOffsetY: number;
  isLoaded: boolean;
  isHighlighted: boolean;
  visible: boolean;
  isFading: boolean;
  name: any;
  x: any;
  y: any;
  gridX: any;
  gridY: any;
  normalSprite: any;
  hurtSprite: any;
  ready_func: any;
  startFadingTime: any;
  blinking: any;
  isDirty: boolean;
  dirty_callback: any;

  constructor(id, kind) {
    this.id = id;
    this.kind = kind;
    this.isDirty = false;

    // Renderer
    this.sprite = null;
    this.flipSpriteX = false;
    this.flipSpriteY = false;
    this.animations = null;
    this.currentAnimation = null;
    this.shadowOffsetY = 0;

    // Position
    this.setGridPosition(0, 0);

    // Modes
    this.isLoaded = false;
    this.isHighlighted = false;
    this.visible = true;
    this.isFading = true;
    this.setDirty();
  }

  setName(name) {
    this.name = name;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setGridPosition(x, y) {
    this.gridX = x;
    this.gridY = y;

    this.setPosition(x * 16, y * 16);
  }

  setSprite(sprite) {
    if (!sprite) {
      console.error(this.id + " : sprite is null", sprite);
      throw "Sprite error";
    }

    if (!sprite.name || (this.sprite && this.sprite.name === sprite.name)) {
      return;
    }

    this.sprite = sprite;
    this.normalSprite = this.sprite;

    if (Types.isMob(this.kind) || Types.isPlayer(this.kind)) {
      this.hurtSprite = sprite.getHurtSprite();
    }

    this.animations = sprite.createAnimations();

    this.isLoaded = true;
    if (this.ready_func) {
      this.ready_func();
    }
  }

  getSprite() {
    return this.sprite;
  }

  getSpriteName(elementOrSkin?: Elements | string) {

    return `${Types.getKindAsString(this.kind)}${elementOrSkin ? `-${elementOrSkin}` : ""}`;
  }

  getAnimationByName(name) {
    var animation = null;

    if (name in this.animations) {
      animation = this.animations[name];
    } else {
      console.error("No animation called " + name);
    }
    return animation;
  }

  setAnimation(name, speed, count = 0, onEndCount?: () => void) {
    var self = this;

    if (this.isLoaded) {
      if (this.currentAnimation && this.currentAnimation.name === name) {
        return;
      }

      var a = this.getAnimationByName(name);

      if (a) {
        this.currentAnimation = a;
        const isAtk = name.substr(0, 3) === "atk";
        const isRaise = name.substr(0, 5) === "raise";
        const isUnraise = name.substr(0, 7) === "unraise";

        if (isAtk || isRaise || isUnraise) {
          this.currentAnimation.reset();
        }

        if (
          this.kind === Types.Entities.ANVIL ||
          this.kind === Types.Entities.WAYPOINTX ||
          this.kind === Types.Entities.WAYPOINTN ||
          this.kind === Types.Entities.WAYPOINTO ||
          (!isRaise &&
            [
              Types.Entities.PORTALCOW,
              Types.Entities.PORTALMINOTAUR,
              Types.Entities.PORTALSTONE,
              Types.Entities.PORTALGATEWAY,
            ].includes(this.kind))
        ) {
          this.currentAnimation.setSpeed(150);
        } else if (
          this.kind === Types.Entities.MAGICSTONE ||
          this.kind === Types.Entities.LEVER ||
          this.kind === Types.Entities.LEVER2 ||
          this.kind === Types.Entities.LEVER3 ||
          this.kind === Types.Entities.STATUE ||
          this.kind === Types.Entities.STATUE2 ||
          this.kind === Types.Entities.ALTARSOULSTONE ||
          this.kind === Types.Entities.DOORDEATHANGEL
        ) {
          this.currentAnimation.setSpeed(100);
        } else if (
          this.kind === Types.Entities.BLUEFLAME ||
          this.kind === Types.Entities.TRAP ||
          this.kind === Types.Entities.TRAP2 ||
          this.kind === Types.Entities.TRAP3 ||
          this.kind === Types.Entities.HANDS
        ) {
          this.currentAnimation.setSpeed(75);
        } else if (this.kind === Types.Entities.ALTARCHALICE) {
          this.currentAnimation.setSpeed(200);
        } else {
          this.currentAnimation.setSpeed(speed);
        }

        this.currentAnimation.setCount(
          count ? count : 0,
          onEndCount ||
            function () {
              // @ts-ignore
              self.idle();
            },
        );
      }
    } else {
      this.log_error("Not ready for animation");
    }
  }

  hasShadow() {
    return false;
  }

  ready(f) {
    this.ready_func = f;
  }

  clean() {
    this.stopBlinking();
  }

  log_info(message) {
    console.info("[" + this.id + "] " + message);
  }

  log_error(message) {
    console.error("[" + this.id + "] " + message);
  }

  setHighlight(value) {
    this.isHighlighted = !!value;

    if (
      value === true &&
      ![Types.Entities.TREE, Types.Entities.TRAP, Types.Entities.TRAP2, Types.Entities.TRAP3].includes(this.kind)
    ) {
      if (!this.sprite.silhouetteSprite) {
        this.sprite.createSilhouette();
      }
      this.sprite = this.sprite?.silhouetteSprite;
    } else {
      this.sprite = this.normalSprite;
    }
  }

  setVisible(value) {
    this.visible = value;
  }

  isVisible() {
    return this.visible;
  }

  toggleVisibility() {
    if (this.visible) {
      this.setVisible(false);
    } else {
      this.setVisible(true);
    }
  }

  /**
   *
   */
  getDistanceToEntity(entity) {
    var distX = Math.abs(entity.gridX - this.gridX),
      distY = Math.abs(entity.gridY - this.gridY);

    return distX > distY ? distX : distY;
  }

  isCloseTo(entity, aggroRange) {
    var dx,
      dy,
      close = false;
    if (entity) {
      dx = Math.abs(entity.gridX - this.gridX);
      dy = Math.abs(entity.gridY - this.gridY);

      if (dx < aggroRange && dy < aggroRange) {
        close = true;
      }
    }
    return close;
  }

  /**
   * Returns true if the entity is adjacent to the given one.
   * @returns {Boolean} Whether these two entities are adjacent.
   */
  isAdjacent(entity) {
    var adjacent = false;

    if (entity) {
      adjacent = this.getDistanceToEntity(entity) > 1 ? false : true;
    }
    return adjacent;
  }

  /**
   *
   */
  isAdjacentNonDiagonal(entity) {
    var result = false;

    if (this.isAdjacent(entity) && !(this.gridX !== entity.gridX && this.gridY !== entity.gridY)) {
      result = true;
    }

    return result;
  }

  isDiagonallyAdjacent(entity) {
    return this.isAdjacent(entity) && !this.isAdjacentNonDiagonal(entity);
  }

  forEachAdjacentNonDiagonalPosition(callback) {
    callback(this.gridX - 1, this.gridY, Types.Orientations.LEFT);
    callback(this.gridX, this.gridY - 1, Types.Orientations.UP);
    callback(this.gridX + 1, this.gridY, Types.Orientations.RIGHT);
    callback(this.gridX, this.gridY + 1, Types.Orientations.DOWN);
  }

  fadeIn(currentTime) {
    this.isFading = true;
    this.startFadingTime = currentTime;
  }

  blink(speed) {
    var self = this;

    this.blinking = setInterval(function () {
      self.toggleVisibility();
    }, speed);
  }

  stopBlinking() {
    if (this.blinking) {
      clearInterval(this.blinking);
    }
    this.setVisible(true);
  }

  setDirty() {
    this.isDirty = true;
    if (this.dirty_callback) {
      this.dirty_callback(this);
    }
  }

  onDirty(dirty_callback) {
    this.dirty_callback = dirty_callback;
  }
}

export default Entity;
