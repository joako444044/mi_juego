
var speed = 10;
var scenariox = 1;
var scenarioy = 0;
var lis_messages = [["sona de campamento para escaladores", "montana peligrosa!!", "pantano de"], ["risco fragil", "entrada al templo", "zona nevada"], ["lago del samurai", "no pasa", "cabana abandonada"]]
var lis_scenarios = [];
var obj_scene = 0;
var rng1 = 0;
var rng2 = 0;
var enemy_count = 0;
var last_room = false;
function preload() {

    character_animation = loadAnimation("./perro_peruano_left_walk1.png");
    ch_walking_animation = loadAnimation("./perro_peruano_left_walk1.png", "./perro_peruano_left_walk2.png");
    ch_atak_animation = loadAnimation("./perro_peruano_left_atk1.png", "./perro_peruano_left_atk2.png");

    enemi_walk = loadAnimation("./cool_fungi0.png", "./cool_fungi1.png");

    boss_walk = loadAnimation("./wizard01.png", "./wizard02.png", "./wizard03.png", "./wizard04.png", "./wizard05.png", "./wizard06.png", "./wizard07.png", "./wizard08.png",)
    boss_standing = loadAnimation("./wizard00.png")
    lis_scenarios = [[loadImage("./camping.jpg"), loadImage("./background.jpg"), loadImage("./lake.png")], [loadImage("./border.jpeg"), loadImage("./entrance_to_temple.jpg"), loadImage("./snow.jpg")], [loadImage("./forest.jpeg"), loadImage("./inrerior.jpeg"), loadImage("cabana.jpg")]]
    im_cartel = loadImage("./cartel.png")

}


function setup() {

    createCanvas(windowWidth, windowHeight);
    rng1 = random(-20, 20);
    rng2 = random(-20, 20);
    info_scenario = [{ "nombre": "00", "limity": height * 0.7, "spawnx": 500, "spawny": 700, "velocityx": "automatico", "velocityy": 0.2 }, { "nombre": "01", "limity": height * 0.5, "spawnx": 0, "spawny": 0 }, { "nombre": "02", "limity": height * 0.6, "spawnx": 500, "spawny": 300, "velicityx": -20, "velocityy": 20 }, { "nombre": "10", "limity": height * 0.5, "spawnx": 0, "spawny": 0 }, { "nombre": "11", "limity": height * 0.3, "spawnx": 500, "spawny": 500, "velocityx": "automatico", "velocityy": 0.5 }, { "nombre": "12", "limity": height * 0.5, "spawnx": 500, "spawny": 500, "velocityx": "automatico", "velocityy": rng1 / 20 }, { "nombre": "20", "limity": height * 0.7, "spawnx": 500, "spawny": 300, "velocityx": -5, "velocityy": 5 }, { "nombre": "21", "limity": height * 0.7, "velocityx": "automatico", "velocityy": 0.4 }, { "nombre": "22", "limity": height * 0.7 }];

    enemy_count = 0;
    character = createSprite(width * 0.5, height * 0.9);
    grupo_enemies = createGroup();

    character.addAnimation("standing", character_animation);
    character.attak = false;
    character.addAnimation("walking", ch_walking_animation);
    character.addAnimation("attak", ch_atak_animation);
    character.scale = 0.5
    character.objects = [];
    cartel = createSprite(width * 0.1, height * 0.7);
    cartel.addImage(im_cartel);
    cartel.scale = 0.1
}


function draw() {
    image(lis_scenarios[scenarioy][scenariox], 0, 0, width, height);
    movement();
    detect_cartel();

    character.overlap(grupo_enemies, lose_live)
    drawSprites();
    enemi_movement();
}

function movement() {
    obj_scene = info_scenario.find(scene => scene.nombre === scenarioy + "" + scenariox);

    if (keyDown(UP_ARROW)) {
        if (!last_room || (character.y > 0 && last_room)) {
            character.y -= speed;
            if (character.scale > 0.05) {
                character.scale -= 0.02
                speed -= 0.4
            }
            character.changeAnimation("walking");

        }
    }
    else if (keyDown(DOWN_ARROW)) {
        if (!last_room || (character.y < height && last_room)) {
            character.y += speed;
            character.changeAnimation("walking");
            if (character.scale < 0.7) {
                character.scale += 0.02
                speed += 0.4
            }
        }
    }
    else if (keyDown(LEFT_ARROW)) {
        if (!last_room || (character.x > 0 && last_room)) {
            character.x -= speed;
            character.changeAnimation("walking");
            character.mirrorX(1);
        }
    }
    else if (keyDown(RIGHT_ARROW)) {
        if (!last_room || (character.x < width && last_room)) {
            character.x += speed;
            character.changeAnimation("walking");
            character.mirrorX(-1);
        }

    } else if (character.getAnimationLabel() != "attak") {
        character.changeAnimation("standing");
    }
    if (keyWentDown(32)) {
        character.changeAnimation("attak");
        character.attak = true;
        setTimeout(() => {
            character.changeAnimation("standing")
            character.attak = false;
        }, 500);
    }
    if (!last_room) {
        if (character.x > width && scenariox != 2) {
            scenariox += 1;
            character.x = 70;
            spawn_enemies();
        } else if (character.x < 0 && scenariox != 0) {
            scenariox -= 1
            character.x = width * 0.95;
            spawn_enemies();
        } else if (scenarioy != 2 && character.y <= obj_scene.limity && character.objects[0] == "hiking boots") {
            character.y = height * 0.6
            scenarioy += 1;
            if (scenarioy == 2 && character.objects[1] == undefined) {
                scenarioy = 1
            }
            character.scale = 0.5;
            speed = 10;
            spawn_enemies();
        } else if (scenarioy != 0 && character.y >= height * 1.1) {
            character.y = height * 0.1
            scenarioy -= 1;
            character.scale = 0.5;
            speed = 10;
            spawn_enemies();
        }
    }

    if (scenarioy == 2 && scenariox == 1 && last_room == false) {
        spawn_boss();
        last_room = true;
    }


}

function detect_cartel() {
    if (character.overlap(cartel)) {
        document.getElementById("instrucciones").style.visibility = "visible";
        document.getElementById("message").innerHTML = lis_messages[scenarioy][scenariox];
    } else {
        document.getElementById("instrucciones").style.visibility = "hidden";
    }
}
function spawn_enemies() {
    obj_scene = info_scenario.find(scene => scene.nombre === scenarioy + "" + scenariox);

    if (obj_scene.spawnx != 0) {
        enemi = createSprite(obj_scene.spawnx + random(-200, 200), obj_scene.spawny + random(-200, 200));
        enemi.addAnimation("walk", enemi_walk);
        enemi.scale = random(1, 100) / 100
        enemi.lives = 1;
        enemi.boss = false;
        grupo_enemies.add(enemi);
        console.log(obj_scene.spawnx)
    }
}
function lose_live(character1, enemy1) {
    if (character.attak == true) {
        if (!enemy1.boss) {
            enemy1.destroy();
            spawn_enemies();
            enemy_count++;
            if (enemy_count == 1) {
                character.objects.push("hiking boots");
                document.getElementById("obtained").style.animation = "apper 8s 1";

            } else if (enemy_count == 2) {
                character.objects.push("dor's key");
                document.getElementById("obtained").style.animation = "apper 8s 1";

            }
        } else {
            if (enemy1.getAnimationLabel() !== "inbulnerable") {
                enemy1.lives -= 1;
                console.log("si");
                enemy1.changeAnimation("inbulnerable");
                setTimeout(() => {
                    enemy1.changeAnimation("walk");
                }, 4000);
            }
            if (enemy1.lives <= 0) {
                console.log("kclde");

                enemy1.destroy();
                swal({
                    title: `Fin del juego`,
                    text: "Ganaste, salvaste el valle del mago, y sus hongos secuases",
                    text: "Tu puntuación es: " + enemy_count,
                    imageUrl:"./no.jpg",
                    imageSize: "100x100",
                    confirmButtonText: "volver a jugar"
                },
                function(){ 
                    location.reload();
                });
            }
            

        }
    } else {
        window.location.reload();
    }
}
function enemi_movement() {


    grupo_enemies.forEach(element => {

        if (obj_scene.velocityx != "automatico" || (element.boss && element.lives == 1)) {
            if (frameCount % 180 == 0) {
                rng1 = random(obj_scene.velicityx, obj_scene.velocityy);
                rng2 = random(obj_scene.velicityx, obj_scene.velocityy);
                element.setSpeedAndDirection(rng1, rng2);
            }
        } else {
            element.attractionPoint(obj_scene.velocityy, character.x, character.y);
        }

    });

    grupo_enemies.forEach(element => {

        if (element.x > width || element.x <= 0 || element.y > height || element.y <= 0) {
            element.setSpeedAndDirection(random(-5, 5), random(-5, 5));
        }

    })

}

function spawn_boss() {
    enemi = createSprite(width / 2, height / 2);
    enemi.addAnimation("walk", boss_walk);
    enemi.addAnimation("inbulnerable", boss_standing)
    enemi.scale = 1
    enemi.boss = true;
    enemi.lives = 3;
    grupo_enemies.destroyEach();
    grupo_enemies.add(enemi);
    console.log("spawn")
}