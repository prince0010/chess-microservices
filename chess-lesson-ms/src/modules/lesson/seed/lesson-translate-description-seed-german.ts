export interface HashedLessonTranslated {
  target: string; // 'en', 'es', 'ka'
  originalDescription: string; // never change do not touch
  translatedDescription: string; // translate this
  hashCode: string; // never change do not touch
}

export const listLessonTranslateDescription: HashedLessonTranslated[] = [
  {
    target: 'ger',
    originalDescription: 'Move the pawn to the marked square',
    translatedDescription: 'Ziehe den Bauern auf das markierte Feld.',
    hashCode:
      '87cf7b202d5ed910690d5bc50ed6280e4949862ab6ccab3816de7e1193fca788',
  },
  {
    target: 'ger',
    originalDescription: 'Move the king to the marked square',
    translatedDescription: 'Ziehe den König auf das markierte Feld.',
    hashCode:
      'a3110a51509ecd38c6551da488a1ca71513d6d9ce7301bb5b55099b8d8790551',
  },
  {
    target: 'ger',
    originalDescription: 'Move the bishop to the marked square',
    translatedDescription: 'Ziehe den Läufer auf das markierte Feld.',
    hashCode:
      'a896f482d143a2df095d08cb0ef55905b7e712c90ad8ddff20ee8b78d51e3fbe',
  },
  {
    target: 'ger',
    originalDescription: 'Move the knight to the marked square',
    translatedDescription: 'Ziehe den Springer auf das markierte Feld.',
    hashCode:
      'bdd042d964f3acf5d48b0eb1f925e1b82242661f91a597c8b015a90642f71bba',
  },
  {
    target: 'ger',
    originalDescription: 'Move the rook to the marked square',
    translatedDescription: 'Ziehe den Turm auf das markierte Feld.',
    hashCode:
      'e555af27f487ab8a1f5e5c3b78a280373e52f4fe8d8834528502b1b29bf554b2',
  },
  {
    target: 'ger',
    originalDescription: 'Move the Queen to marked square',
    translatedDescription: 'Ziehe die Dame auf das markierte Feld.',
    hashCode:
      '521b0c60bf5e1a45219ea250830d4df017296c2f342d91e1682f8dfe0647d5b5',
  },
  {
    target: 'ger',
    originalDescription: 'Play a short castle',
    translatedDescription: 'Rochiere kurz.',
    hashCode:
      'eb50d89643a439fb28ec2e4b0f96371f1602c773f83c64d9e32b14f29d23a298',
  },
  {
    target: 'ger',
    originalDescription: 'Play a long castle',
    translatedDescription: 'Rochiere lang.',
    hashCode:
      'a1318ce3b17b6ee3fffdbfd2a008454d20f4365c084c228b8f6930a115979bc2',
  },
  {
    target: 'ger',
    originalDescription: 'Give check to the black king',
    translatedDescription: 'Setze den schwarzen König Schach.',
    hashCode:
      '3a91ea1d42601fff0471c7c0ae76bd63b023b00ac0f2143c7760cc7db7a401d2',
  },
  {
    target: 'ger',
    originalDescription: 'Promote a pawn to a Queen',
    translatedDescription: 'Befördere einen Bauern zu einer Dame.',
    hashCode:
      '2b640506a4aa65c32e89787595fb1e9d4bfb597b87e35735c8efc250e92c43e9',
  },
  {
    target: 'ger',
    originalDescription: 'Promote a pawn to a rook',
    translatedDescription: 'Befördere einen Bauern zu einem Turm.',
    hashCode:
      'c85e764d0ba7b6bfab1e34e783b2fbf1fc5b709163f674d26557aae08827ef45',
  },
  {
    target: 'ger',
    originalDescription: 'Promote a pawn to a bishop',
    translatedDescription: 'Befördere einen Bauern zu einem Läufer.',
    hashCode:
      '3966126adf6e40bcff9e5251669d1913f1254ba565ad8062c942f158c1ca9f9e',
  },
  {
    target: 'ger',
    originalDescription: 'Promote a pawn to a knight',
    translatedDescription: 'Befördere einen Bauern zu einem Springer.',
    hashCode:
      '6775334ad048b21c9b2260d60a5084276a8e3e141692d0e0165178e27e4c9f79',
  },
  {
    target: 'ger',
    originalDescription:
      'Stalemate the black king\n\nStalemate is a\nsituation where the player whose turn it is to move is not in check but has no\nlegal move to continue the game. The rules of chess provide that when\nstalemate occurs, the game ends as a draw (i.e. having no winner).',
    translatedDescription:
      'Zwinge den schwarzen König ins Patt.\n\nPatt ist eine Situation, in der der Spieler am Zug nicht im Schach steht, aber keinen legalen Zug zur Fortsetzung der Partie hat. Die Schachregeln sehen vor, dass bei Patt die Partie remis endet (d.h. ohne Sieger).',
    hashCode:
      'a2a9c5a1e0f6a74b770f910f5a6f05811300f27eae49de84e4ad2e1bc2cd78da',
  },
  {
    target: 'ger',
    originalDescription: 'Stalemate the black king',
    translatedDescription: 'Zwinge den schwarzen König ins Patt.',
    hashCode:
      '894d5c43a2053463463eae8867fd72f5b0a0239722a83bd1ef855ac62f7a0582',
  },
  {
    target: 'ger',
    originalDescription: 'Take the black pawn en passant',
    translatedDescription: 'Schlage den schwarzen Bauern en passant.',
    hashCode:
      'b4a144ff7fe86a2633e41c4b6aa7ed9dc881c49b8319e13a42452811797e12fd',
  },
  {
    target: 'ger',
    originalDescription: 'Pawn takes',
    translatedDescription: 'Bauer schlägt.',
    hashCode:
      'ebb201a4a010686a2e5d8cd7bb3259689b876523a33f25372497e90fe456433b',
  },
  {
    target: 'ger',
    originalDescription: 'Find the shortest way for the knight to d7!',
    translatedDescription: 'Finde den kürzesten Weg für den Springer nach d7!',
    hashCode:
      '844ebbc236846c27787f9562c241cf199a9021bc6f85ec20ce8da1240650948d',
  },
  {
    target: 'ger',
    originalDescription: 'Find the shortest way for the bishop to c7!',
    translatedDescription: 'Finde den kürzesten Weg für den Läufer nach c7!',
    hashCode:
      '5b4d223f953a1e3fad6c8d488064d8c94ca8968305240e140b8b974747a803bc',
  },
  {
    target: 'ger',
    originalDescription:
      'Find the shortest possible way to get the rook to a4!',
    translatedDescription:
      'Finde den kürzestmöglichen Weg, um den Turm nach a4 zu bringen!',
    hashCode:
      'c46d30f7c6a34381c6315d8a1a1413b91f7a7c8b36010c802c6d65cb863860e6',
  },
  {
    target: 'ger',
    originalDescription: 'Try to make a queen from the a-pawn!',
    translatedDescription: 'Versuche, aus dem a-Bauern eine Dame zu machen!',
    hashCode:
      '6e58d714089e5eaa541cda62b7c7832c2600e7bb0944dd4586d2338fb5815e4d',
  },
  {
    target: 'ger',
    originalDescription: 'Give a check in one move!',
    translatedDescription: 'Setze in einem Zug Schach!',
    hashCode:
      '3f79ec2854ed9f8bae7f9a8c3e6fd2510604b2b74e18c98f1d9262586f25221b',
  },
  {
    target: 'ger',
    originalDescription: 'Castle queenside!',
    translatedDescription: 'Rochiere lang (Damenflügel)!',
    hashCode:
      '2b8a011c9119730bf02959edadfbb440faa85c3a2d21ab2555293847df7c6793',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer your knight to d5 on the shortest way!',
    translatedDescription:
      'Bringe deinen Springer auf dem kürzesten Weg nach d5!',
    hashCode:
      '454b83201e630aab4dac85e7b7a72f9fb136ef9b403083e379efa6d05813620f',
  },
  {
    target: 'ger',
    originalDescription: 'Get your bishop to e8 on the shortest way!',
    translatedDescription:
      'Bringe deinen Läufer auf dem kürzesten Weg nach e8!',
    hashCode:
      '2e16715a5d2e126cb8c2b819ad8b762d0d27623a330e79de9fa684e50c4ae674',
  },
  {
    target: 'ger',
    originalDescription: 'Find the shortest way for the rook to c8!',
    translatedDescription: 'Finde den kürzesten Weg für den Turm nach c8!',
    hashCode:
      '307b4c1d7f6712b4c1c32a1de390cb571102b6ec38074a91363ad1e5b77ea4b4',
  },
  {
    target: 'ger',
    originalDescription: 'Castle kingside!',
    translatedDescription: 'Rochiere kurz (Königsflügel)!',
    hashCode:
      '43dc973f14f25bda0889c11b2e022c0d8569981c17d3ede54e6ef5e4250b0c5e',
  },
  {
    target: 'ger',
    originalDescription: 'Promote your pawn faster than your opponent!',
    translatedDescription: 'Befördere deinen Bauern schneller als dein Gegner!',
    hashCode:
      '6108a2d197cadb9d331c35b9dd03cbf2f24ab26d99ebcf548ae97e181f5e9161',
  },
  {
    target: 'ger',
    originalDescription: 'Squeeze the Black king to the corner!',
    translatedDescription: 'Treib den schwarzen König in die Ecke!',
    hashCode:
      '2cf6f6ad61f635cc560e2c93b6c08f8fea27d7226fc4b319159f6c59627aa9eb',
  },
  {
    target: 'ger',
    originalDescription: 'Find the shortest way for the knight to a8!',
    translatedDescription: 'Finde den kürzesten Weg für den Springer nach a8!',
    hashCode:
      '61b9e606cb81a6e84137b498465f4491ff1afe79d28032470f8f7e7ae7a41be1',
  },
  {
    target: 'ger',
    originalDescription: 'Try to promote a queen!',
    translatedDescription: 'Versuche, eine Dame zu bekommen!',
    hashCode:
      '5d4976b57e4c02d7d9ff12fc767d8c88eca92e5c35f3a084f13e7631fb391a6b',
  },
  {
    target: 'ger',
    originalDescription: 'Get the knight to g4 on the shortest way!',
    translatedDescription: 'Bringe den Springer auf dem kürzesten Weg nach g4!',
    hashCode:
      '56e1a3d0eb00a2b2ea889174477a86d1ac734f5cf29c0102cd59407b0b078a51',
  },
  {
    target: 'ger',
    originalDescription: 'Get the bishop to c5 on the shortest way!',
    translatedDescription: 'Bringe den Läufer auf dem kürzesten Weg nach c5!',
    hashCode:
      'fb9e55c50369de55296058247f8eef464b851e7b27a065c65a1ad3fac71b9492',
  },
  {
    target: 'ger',
    originalDescription: 'Move with the queen to a8!',
    translatedDescription: 'Ziehe mit der Dame nach a8!',
    hashCode:
      'b7db933de514deacf284b1cd532855a0bb51bc9aafcf1ff5f134b82965bbd23b',
  },
  {
    target: 'ger',
    originalDescription: 'Give a check to the king!',
    translatedDescription: 'Setze den König Schach!',
    hashCode:
      'a30ccec399131b63a27541e12f32386b252ebda59ede755891e95280bed38761',
  },
  {
    target: 'ger',
    originalDescription: 'Move the queen to e5!',
    translatedDescription: 'Ziehe die Dame nach e5!',
    hashCode:
      '15039dfb0170104fad05cf52361b1eeb7c3ecaad54c1b761c35c8ad8c6580567',
  },
  {
    target: 'ger',
    originalDescription:
      'Reach the d5 square with the knight on the shortest way!',
    translatedDescription:
      'Erreiche mit dem Springer auf dem kürzesten Weg das Feld d5!',
    hashCode:
      '5d27236daed1a8c53fb42d0e6d0099722d3e4e796ba617402dcab69ff1676b48',
  },
  {
    target: 'ger',
    originalDescription: 'Move the rook to b6!',
    translatedDescription: 'Ziehe den Turm nach b6!',
    hashCode:
      'fd0b4286e39501674e07f0e49a1b01e51fe118969eaa979ae1a6840c8770c654',
  },
  {
    target: 'ger',
    originalDescription: 'Try to promote the pawn!',
    translatedDescription: 'Versuche, den Bauern umzuwandeln!',
    hashCode:
      'f843ffab89b37051516cf2c8424a8c8a3e07c5f327c30e5990c5d5b6f8bdd8da',
  },
  {
    target: 'ger',
    originalDescription: 'Find the shortest way to d5 with the knight!',
    translatedDescription: 'Finde den kürzesten Weg mit dem Springer nach d5!',
    hashCode:
      '3f9b932386f966ed49fed5610aa7ab7a8c28022063fd1512b858dfa5feff12db',
  },
  {
    target: 'ger',
    originalDescription: 'Get the bishop to a6 in two moves!',
    translatedDescription: 'Bringe den Läufer in zwei Zügen nach a6!',
    hashCode:
      'f2f464318dee82d72b2b4bd7187b549165906d0dd0e9f8ad7659002fe9150d84',
  },
  {
    target: 'ger',
    originalDescription: 'Move the queen to g3!',
    translatedDescription: 'Ziehe die Dame nach g3!',
    hashCode:
      '307e7cd9b369cb56c307b3f20665efeeeac3da3acd0b0d7817970688e4acba05',
  },
  {
    target: 'ger',
    originalDescription: 'Get the knight to a6 in three moves!',
    translatedDescription: 'Bringe den Springer in drei Zügen nach a6!',
    hashCode:
      '14b9c99f00b887bb9b6b5b0fd29cb5815f3b24e4b2fe035e85820852d24cc6c5',
  },
  {
    target: 'ger',
    originalDescription: 'Get the bishop to h6 in two moves!',
    translatedDescription: 'Bringe den Läufer in zwei Zügen nach h6!',
    hashCode:
      '55262363630ee0a00f57166563c6c6485549395a16b035b1a790392241ddb68e',
  },
  {
    target: 'ger',
    originalDescription: 'Get the rook to c6 in two moves!',
    translatedDescription: 'Bringe den Turm in zwei Zügen nach c6!',
    hashCode:
      '0d37d39c0369f64765b1a2d45748d94be426513d3b7879d11b28f13b0d8475cd',
  },
  {
    target: 'ger',
    originalDescription: 'Move the queen to b6!',
    translatedDescription: 'Ziehe die Dame nach b6!',
    hashCode:
      '982d0468ea32dd264a70c7f9cd18b9b5aad4c00feb8fcbeb32093681e486cb74',
  },
  {
    target: 'ger',
    originalDescription: 'Try to make a queen!',
    translatedDescription: 'Versuche, eine Dame zu machen!',
    hashCode:
      'baf4e92ce9cdd9547b8d36956b9f619b1c50279376b93479aca7d3c666c8a616',
  },
  {
    target: 'ger',
    originalDescription: 'Get the knight to b5 in three moves!',
    translatedDescription: 'Bringe den Springer in drei Zügen nach b5!',
    hashCode:
      '0a6e9f7762eedfd1629ab2fd632ed34633c6c4e0ee7ff30b21e43e9233cf5ec7',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the bishop to h8 in two moves!',
    translatedDescription: 'Bringe den Läufer in zwei Zügen nach h8!',
    hashCode:
      '2a276b335162ae40878822918ffaff0f0d691970ab6c85b1ca429ee0900e6274',
  },
  {
    target: 'ger',
    originalDescription: 'Move your queen to d4!',
    translatedDescription: 'Ziehe deine Dame nach d4!',
    hashCode:
      '399595604ad063b18e53a4c5ace9650a38a41226911f1e954cbc78997f31b68e',
  },
  {
    target: 'ger',
    originalDescription: 'Promote the pawn on the fastest way!',
    translatedDescription: 'Befördere den Bauern auf dem schnellsten Weg!',
    hashCode:
      'fec58a8f9249aced7f1f6eaafb7547d039b0cfbeacfa8a4c7a78cb0be9c466dc',
  },
  {
    target: 'ger',
    originalDescription: 'Find the shortest way to c7 for the knight!',
    translatedDescription: 'Finde den kürzesten Weg für den Springer nach c7!',
    hashCode:
      '5ea2aabe9cd9cdaec3e61b08c8fa422229580632896c6c69496ae1647852a8b0',
  },
  {
    target: 'ger',
    originalDescription: 'Drive the bishop to b7 in two moves!',
    translatedDescription: 'Bringe den Läufer in zwei Zügen nach b7!',
    hashCode:
      'e09c4e51af4c4bf4c2089ba0a8650cb68510f7bb403ad00ebdd8d25354a2fbc6',
  },
  {
    target: 'ger',
    originalDescription: 'Get the rook to e6 in two moves!',
    translatedDescription: 'Bringe den Turm in zwei Zügen nach e6!',
    hashCode:
      '9f171ea5f3af131f49e283834702cab92acc823e13c74e4c74a208fa7face2ba',
  },
  {
    target: 'ger',
    originalDescription: 'Move the queen to g7!',
    translatedDescription: 'Ziehe die Dame nach g7!',
    hashCode:
      '13a8e6dadc40f13a5fa02ea5f46a99286e0faa14295a58202d3b4638845a08c1',
  },
  {
    target: 'ger',
    originalDescription: 'Run with the king to a1!',
    translatedDescription: 'Laufe mit dem König nach a1!',
    hashCode:
      'c770dc74a7790f8df29077845d790c748224a629fb7fb6b0841295d3879ca158',
  },
  {
    target: 'ger',
    originalDescription: 'Try to make a queen from the h-pawn!',
    translatedDescription: 'Versuche, aus dem h-Bauern eine Dame zu machen!',
    hashCode:
      '8d985c132948bd81e0e9606365b0df4c2dfab8717fa380e70c36a82d1e02a1be',
  },
  {
    target: 'ger',
    originalDescription: 'Find the shortest way for the knight ot a6!',
    translatedDescription: 'Finde den kürzesten Weg für den Springer nach a6!',
    hashCode:
      'b2b3fb62f1b5051bed45626ba6d6924f081d73e17f0f5fb1927923e4bd9fc0be',
  },
  {
    target: 'ger',
    originalDescription: 'Promote the pawn into a knight!',
    translatedDescription: 'Befördere den Bauern zu einem Springer!',
    hashCode:
      '37789e48cbca607e5754e5b120a11991968daf41cc21169342c7f50dd93e3dbf',
  },
  {
    target: 'ger',
    originalDescription: 'Promote the pawn into a bishop!',
    translatedDescription: 'Befördere den Bauern zu einem Läufer!',
    hashCode:
      '17faa1f32f4b76a3de864b3af6c854b7eeedf6579f382f52b31c252d580d7edd',
  },
  {
    target: 'ger',
    originalDescription: 'Promote the pawn into a rook!',
    translatedDescription: 'Befördere den Bauern zu einem Turm!',
    hashCode:
      '1666aa107e76dbb36808ebecafbef7bf92554c1755dd50c981125b603ae8e932',
  },
  {
    target: 'ger',
    originalDescription: 'Eat the black pawn!',
    translatedDescription: 'Schlage den schwarzen Bauern!',
    hashCode:
      'eff3c96cdb8e464d7d5dfe36c26df9eb545bea463432340c07126a9bee6c287d',
  },
  {
    target: 'ger',
    originalDescription: 'Bring the knight to b3!',
    translatedDescription: 'Bringe den Springer nach b3!',
    hashCode:
      'e20e1204fdf189fdea94cc6abfd9072b2276c19450f5fca26dbfc9d3471647c0',
  },
  {
    target: 'ger',
    originalDescription:
      'Take the white king to the a5 square on the shortest way!',
    translatedDescription:
      'Bringe den weißen König auf dem kürzesten Weg zum Feld a5!',
    hashCode:
      '0862c0716c69c1a4e43eabbf3f0a1f2b1e9b6c2d0785c797d24c93697ec409be',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white king to d1!',
    translatedDescription: 'Ziehe den weißen König nach d1!',
    hashCode:
      '42ecd4471615161cd8a6c5d14dc5464e9beaafe84c4a287561f0175c27cd0591',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white king to f4!',
    translatedDescription: 'Ziehe den weißen König nach f4!',
    hashCode:
      '6fe9fd0d263c941881241a2c00cc9195131baebb350b3a6748d65743ec739df0',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white knight to e4!',
    translatedDescription: 'Ziehe den weißen Springer nach e4!',
    hashCode:
      '4b1a798e6c24178594fc486068546e3739065778d76c52b03791c8e7e5700bc5',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white knight to f4!',
    translatedDescription: 'Ziehe den weißen Springer nach f4!',
    hashCode:
      '96a322654adb1ea365bbdc714f555dc5f1774cb0630cd822e34c7a18bb07d46a',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white knight to c8!',
    translatedDescription: 'Ziehe den weißen Springer nach c8!',
    hashCode:
      'b0c61072bd035a3e4ec6e8f8193ad6b79f42a8f6fd60911ceef1817ec355cb6d',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white knight to b6!',
    translatedDescription: 'Ziehe den weißen Springer nach b6!',
    hashCode:
      'b4fe94e1e420fe9234c6783ce1dee1b391ab9cf21879179f89c85ae443c7dec5',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white knight to e6!',
    translatedDescription: 'Bringe den weißen Springer nach e6!',
    hashCode:
      'cbc09c89ab1fc9019ba2fef14e7ab89fb279631664d8d850c04bc6ba3c50e6c1',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white knight to b5!',
    translatedDescription: 'Bringe den weißen Springer nach b5!',
    hashCode:
      'f4590347e04135e4a47e4c3ef7df601e95bf226c950912c1251eb73c22c79dac',
  },
  {
    target: 'ger',
    originalDescription: 'Bring the white bishop to the b4 square!',
    translatedDescription: 'Bringe den weißen Läufer zum Feld b4!',
    hashCode:
      '069f22e5b59340aeb1aa803201cf312cf8a6976ffb1122909589faf5eeb3a4fa',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white bishop in two moves to the c1 square!',
    translatedDescription:
      'Bringe den weißen Läufer in zwei Zügen zum Feld c1!',
    hashCode:
      '1e77f2ce86e0ba2eb660ca37852d86bffdcd6c2280ba4bb7dba166b0dba13ba6',
  },
  {
    target: 'ger',
    originalDescription: 'Give a check to the black king on the e2 square!',
    translatedDescription: 'Setze den schwarzen König auf e2 Schach!',
    hashCode:
      '67ee005c3b57b9cd066f5b17cecd78c50ee8f58caff9f1b873f870642f7f350f',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white bishop to h5!',
    translatedDescription: 'Ziehe den weißen Läufer nach h5!',
    hashCode:
      '8ed078905368caac5601e7878561db518b7537d1ba2687a318f1ffbb211f266b',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white bishop to the h8 square!',
    translatedDescription: 'Ziehe den weißen Läufer zum Feld h8!',
    hashCode:
      '3f68908ec08506f2975d5522b97da1d048846b29c7b0daa765ef0629ffb7a116',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white bishop to the a8 square!',
    translatedDescription: 'Bringe den weißen Läufer zum Feld a8!',
    hashCode:
      'a2d978acfbe27601a9a2200f0ed68ef62f89207334bf7ced4181833b21da6181',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white bishop to b1!',
    translatedDescription: 'Ziehe den weißen Läufer nach b1!',
    hashCode:
      '5fbf42b0e3dc5931c9a49aaf1ad239a82b7a1d1db94ca654a548d69df5f80519',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white bishop to the f7 square!',
    translatedDescription: 'Ziehe den weißen Läufer zum Feld f7!',
    hashCode:
      '8af4250b20ecaa56768d6e3ff169121212fe821461527ff19b9612d4d2175be6',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white bishop to d8!',
    translatedDescription: 'Ziehe den weißen Läufer nach d8!',
    hashCode:
      '4dcbf2f9b5da7a1a2fb6bd507beea05dc86863f0187c1a31e92882f1b68149f4',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white bishop to the e8 square!',
    translatedDescription: 'Ziehe den weißen Läufer zum Feld e8!',
    hashCode:
      '2e3688027e5f2a965c2320b31a75538839e05933e890c53cefc2b58808213c07',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white rook to a7!',
    translatedDescription: 'Bringe den weißen Turm nach a7!',
    hashCode:
      'd1aac0547bcee8eae2ee9ca9eec93cb9049ed005e0771bceff40ce6fcf2fa538',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white rook to h8!',
    translatedDescription: 'Bringe den weißen Turm nach h8!',
    hashCode:
      'febcfae8acc0d377e0a07cc2f5b23a0b09625203fd60760dc30a0b4ec8cc217c',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white rook to the e5 square!',
    translatedDescription: 'Ziehe den weißen Turm zum Feld e5!',
    hashCode:
      '19aee6eed4b76d67525a58befa10efb46cef92682d9f23be9ae8da35b4ea2a29',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white rook to the b1 square!',
    translatedDescription: 'Ziehe den weißen Turm zum Feld b1!',
    hashCode:
      '206518d006e75b4d4b9ff62f0b6f17e47efbea991c193c27e65f7380e9625090',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white rook to f3!',
    translatedDescription: 'Ziehe den weißen Turm nach f3!',
    hashCode:
      '45d2f4eb26158d2e26caa7f85d12ececfec1657ed84776c0822412787eb92578',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white rook to the d6 square!',
    translatedDescription: 'Bringe den weißen Turm zum Feld d6!',
    hashCode:
      'a69a9ab7f74cce4e338a8fd06a33fbbe0425e91991f315a06b793dc46cb7b6ac',
  },
  {
    target: 'ger',
    originalDescription: 'Take the white rook to e4!',
    translatedDescription: 'Bringe den weißen Turm nach e4!',
    hashCode:
      '43707cea549f4e3fad7dd5cf1d161b61143c9272eab3a9f5f575557ddca793ae',
  },
  {
    target: 'ger',
    originalDescription: 'Take the white rook to c2!',
    translatedDescription: 'Bringe den weißen Turm nach c2!',
    hashCode:
      'e448e88005291f3c1dbb282808f79bb84f07e79605b67a2c81098237d9803a10',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white queen to d2!',
    translatedDescription: 'Ziehe die weiße Dame nach d2!',
    hashCode:
      '98270d021224fe5a0d1b6d40b11638c3518b1b3777270c9803a2d95f80cb7551',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white queen to g8!',
    translatedDescription: 'Ziehe die weiße Dame nach g8!',
    hashCode:
      '5e010b38199eaefe305d047caca8604cd7e4eda2ca0940e514162566093da723',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white queen to the a8 square!',
    translatedDescription: 'Bringe die weiße Dame zum Feld a8!',
    hashCode:
      '85d7ec2dbf4ebcdf477d11bbe6a1b68c77d3e5ef33d7eea4ba957d0df8bed18c',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white queen to the h8 square!',
    translatedDescription: 'Ziehe die weiße Dame zum Feld h8!',
    hashCode:
      '387caac4a25fb340eb4370e99fbcd8bc69f6fe73658e5d3189e9a60676c5d906',
  },
  {
    target: 'ger',
    originalDescription: 'Take the white queen to the e3 square!',
    translatedDescription: 'Bringe die weiße Dame zum Feld e3!',
    hashCode:
      'b834dfa0f6da4c3d4ee6c6be09a6fc22bab196c181eb9f488d637ea0d47978a8',
  },
  {
    target: 'ger',
    originalDescription: 'Take the white queen to the b8 square!',
    translatedDescription: 'Bringe die weiße Dame zum Feld b8!',
    hashCode:
      '5a2714095ea063c0ec157177017e8438b529e5b7079c0aa350b373c465ff13d1',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white queen to the d5 square!',
    translatedDescription: 'Bringe die weiße Dame zum Feld d5!',
    hashCode:
      '62963e15792e1dd073c148a3e1389f1da9842669f044d3b781348cbf11bee079',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white queen to d7!',
    translatedDescription: 'Ziehe die weiße Dame nach d7!',
    hashCode:
      '3f78279412d5403c41341b224af8cab20447655b1750d336ab3d7cee08fb8b29',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white queen to b3!',
    translatedDescription: 'Ziehe die weiße Dame nach b3!',
    hashCode:
      '3e945520489cbff53f1c96f2083f3a02c532ac05313e55faa5e8cc8e0a9be5bb',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white knight to h8!',
    translatedDescription: 'Ziehe den weißen Springer nach h8!',
    hashCode:
      'afd80f988e03e6d491e9bfc2cb2bf798bc082344a83281d00aeb6e92bb4d9a97',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white bishop to c3!',
    translatedDescription: 'Ziehe den weißen Läufer nach c3!',
    hashCode:
      '97947ef78afa96d3dd7c917e1bd3033f489169fb9fe42288209eed7ec0a47653',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white rook to a2!',
    translatedDescription: 'Bringe den weißen Turm nach a2!',
    hashCode:
      'e078e8fd164bcd65145d734d58f0494ad00b64012f068e9bb53a5ee45d5944eb',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white knight to the d2 square',
    translatedDescription: 'Bringe den weißen Springer zum Feld d2.',
    hashCode:
      '91c0e08ed61a543de9d4e947ea250b52d572124126d321f858f39eb01e4bd543',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white queen to the g4 square!',
    translatedDescription: 'Ziehe die weiße Dame zum Feld g4!',
    hashCode:
      'c9d1752bdc7abbae30f9a493a3c81b362a98ae41a71aa2aefdffb8f1ce4a1ed3',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white pawn to the d4 square!',
    translatedDescription: 'Ziehe den weißen Bauern zum Feld d4!',
    hashCode:
      '78b9511b8de2c5c3d6f78322c186332f46fb8d73a79faab468eaa53daaff618d',
  },
  {
    target: 'ger',
    originalDescription: 'Promote the white pawn into a queen in only 5 moves!',
    translatedDescription:
      'Befördere den weißen Bauern in nur 5 Zügen zu einer Dame!',
    hashCode:
      '431f78b8a3b5c6228a3c2a860f3297110fb26467a3e2d66b384d6a1a867c2b44',
  },
  {
    target: 'ger',
    originalDescription:
      'Bring the white pawn to the h4 square in only 1 move!',
    translatedDescription:
      'Bringe den weißen Bauern in nur einem Zug zum Feld h4!',
    hashCode:
      '8c55a3295e0606420afd1ebc783f6ce57b438333eeff8aada465593895bc854c',
  },
  {
    target: 'ger',
    originalDescription: 'Bring the white king to h1 as fast as possible!',
    translatedDescription:
      'Bringe den weißen König so schnell wie möglich nach h1!',
    hashCode:
      'abd66b917251761f72df7dc4a48518193496f020fd1d97d2f559599855b7c732',
  },
  {
    target: 'ger',
    originalDescription: 'Bring the white king to a1 as fast as possible',
    translatedDescription:
      'Bringe den weißen König so schnell wie möglich nach a1.',
    hashCode:
      '5dfca2fa94ff6dd9fb5542f81c7857b7e6f211fc011e144f2517c89b0f8061ff',
  },
  {
    target: 'ger',
    originalDescription: 'Take the white king to h8 as fast as possible!',
    translatedDescription:
      'Bringe den weißen König so schnell wie möglich nach h8!',
    hashCode:
      '1a5eff747f59f8ef14e3d5e1d54ba74efeca1e147a0a770fe4697758bbf89c4b',
  },
  {
    target: 'ger',
    originalDescription: 'Bring the white king to a8 as fast as possible',
    translatedDescription:
      'Bringe den weißen König so schnell wie möglich nach a8.',
    hashCode:
      '69b9f155a260aed0e7a9d9a89b738e34a3da020df11a70db5760bc8067ce4bed',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white king to b8 on the shortest route',
    translatedDescription:
      'Bringe den weißen König auf dem kürzesten Weg nach b8.',
    hashCode:
      '295253d5880dabf1b4ee2e3b32b1f19d342b09425f42abf2744883e2822cf318',
  },
  {
    target: 'ger',
    originalDescription: 'Bring the white bishop to f8 in two moves',
    translatedDescription: 'Bringe den weißen Läufer in zwei Zügen nach f8.',
    hashCode:
      '895ff3ddad71c44370e86b341a9082b1a0bfe19c66937083743d0ecbd8dc937d',
  },
  {
    target: 'ger',
    originalDescription: 'Bring the white bishop to g6 in two moves',
    translatedDescription: 'Bringe den weißen Läufer in zwei Zügen nach g6.',
    hashCode:
      '8f014ffb7b817b2b779ad2bb18fcff59c48a85186be72e4e62739f38ae52fbf6',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white bishop to g5 in two moves',
    translatedDescription: 'Bringe den weißen Läufer in zwei Zügen nach g5.',
    hashCode:
      '8ddcc8e16f6d1e1271566abe3566c62fc9fabdfb6fd1221def5c378b6bf60549',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white bishop to h4 in two moves',
    translatedDescription: 'Bringe den weißen Läufer in zwei Zügen nach h4.',
    hashCode:
      '0364d1b33bd5129a6f23bbf0634bf7231cf757a1f9bfaaa17b26441de464ec21',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white bishop to h7 in two moves',
    translatedDescription: 'Bringe den weißen Läufer in zwei Zügen nach h7.',
    hashCode:
      '7b2b05151c7383b9553f2ec0b717350afcfaeed4273409368ecc0ae41642f40f',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white knight to b5 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach b5.',
    hashCode:
      'b7f24a3bde26b8e944a8f641b667e9cb3d203916cc513bfb16a979296079d9e6',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white knight to d4 in two moves',
    translatedDescription: 'Ziehe den weißen Springer in zwei Zügen nach d4.',
    hashCode:
      '65b8e0be5e3ee53efb987cfccfc331fc1364f4bc7574b323fe2e68d7c84273b1',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white knight to c7 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach c7.',
    hashCode:
      '04124a5ffe3a76e2344a01a6ae8812684f15063a912386e2282b318a7a91b971',
  },
  {
    target: 'ger',
    originalDescription: 'Drive the white knight to f3 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach f3.',
    hashCode:
      'f9d3b88d093d3897d7238742f2891d26d870a1a94b2398eb15eaddbc0a0a6429',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white knight to h4 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach h4.',
    hashCode:
      'fdfc9ecba93fcc7fbf4f58d5e50497d87b1697356f96289422873a0d1ff5b44a',
  },
  {
    target: 'ger',
    originalDescription: 'Bring the white knight to g4 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach g4.',
    hashCode:
      'ecdd2761677da07bb5c93c20bc9b45e6de3755746d3a8bbab61ff34dd47ca856',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white knight to g5 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach g5.',
    hashCode:
      '0fdbf5ca95c91a043c6b20d7fda0b2677f2cf15b8b91501a47976825d729e7d0',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white knight to a7 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach a7.',
    hashCode:
      '19bcd668b14658ddb0444060401aebff30501bf118815963adf86fa2c483cf67',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white knight to g8 in two moves',
    translatedDescription: 'Ziehe den weißen Springer in zwei Zügen nach g8.',
    hashCode:
      '5ba24b79dbe5c563f232fdc23b09556f6c190c18bcc84adb8f0803af0d097fea',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white knight to f7 in two moves',
    translatedDescription: 'Ziehe den weißen Springer in zwei Zügen nach f7.',
    hashCode:
      '7e434ec5afdf18a165f8397de4d47e1bb8891d7b0d04268783059959931492e2',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white knight to c2 in two moves',
    translatedDescription: 'Ziehe den weißen Springer in zwei Zügen nach c2.',
    hashCode:
      '5f70f743b03d659c8c16d065a5ca77894881c02ca2dd23d0ea33c1940c4b98de',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white rook to a1 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach a1.',
    hashCode:
      '707e8986289d47d43d86bd3d1c3d045e8a4af851a4d208db5876af02872aed8f',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white rook to h2 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach h2.',
    hashCode:
      '40ccd4ddc47975a50aa88d440dbc9d9da7782226f9e164c45a3a8c6f1e7e035e',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white rook to g7 in two moves',
    translatedDescription: 'Ziehe den weißen Turm in zwei Zügen nach g7.',
    hashCode:
      '0bd3cc215755d5c28dc47e13c286c74f25e02e15b605b94834894e6bc6786011',
  },
  {
    target: 'ger',
    originalDescription: 'Bring the white rook to a8 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach a8.',
    hashCode:
      '74211c56b8b88eff7fabc62d06dd0e1e580a4acafb2ee22e4a1dbc7ca46b3f7b',
  },
  {
    target: 'ger',
    originalDescription: 'Take the white rook to h8 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach h8.',
    hashCode:
      '64010b2013ce38b42812ddcffbdc1adc75a7c9569d064188b2dae7fe9cf4ba5e',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white rook to h7 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach h7.',
    hashCode:
      '9a522fc553333e3e094f553f88a86e8a6b0ffc11cdc3a78e485a61d608e7dc94',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white rook to a3 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach a3.',
    hashCode:
      'b41291406ed5ddb0e314c57378fc00fb5acd1f424926226b38ff16d41858181d',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white rook to a8 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach a8.',
    hashCode:
      'abcd03b94f219e80bef96611462ebc0078c5d1603627161a7443bbb274ef5da3',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white rook to b8 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach b8.',
    hashCode:
      '20f7f9d472f398fbf9a85b395aa702b2e2a6771cd4c6831b42c9aa917290cdc1',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white rook to c8 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach c8.',
    hashCode:
      '639288faf87162b320d62ca21d66e5b6dc0b62f2a9657e4224bc1ce72977dd69',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white rook to b7 in two moves',
    translatedDescription: 'Ziehe den weißen Turm in zwei Zügen nach b7.',
    hashCode:
      'bcba55a2ba7082d1de3e9af2c2e6ed281a692bee466340f166fc1dc10c65d6c6',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white rook to a6 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach a6.',
    hashCode:
      'efbbeeae9c977199a1f3f732fa96b7fc1fb83df996d13e2f6bdbb295ac4d0112',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white rook to h8 square in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen zum Feld h8.',
    hashCode:
      '6a062bbd96a4e80dcbfd20fe1f98e959de32c23e581f3b9d4cf9e48fcba69b6c',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white rook to h1 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach h1.',
    hashCode:
      '6686f6341dbb024db31e201f4f6f2a5b5da06219dd705014b1ba9a2aabd1e8ef',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white bishop to b6 in two moves',
    translatedDescription: 'Bringe den weißen Läufer in zwei Zügen nach b6.',
    hashCode:
      'ed86fae1f520a0c6d8ac81fe7bb2e157d6a20ccde742cf2b7bf239e0f6353c51',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white bishop to f5 in two moves',
    translatedDescription: 'Bringe den weißen Läufer in zwei Zügen nach f5.',
    hashCode:
      'd4dada044436d6295a5bb7b658d7d20c4ba2a55bc09af24221b09ce111cabcfc',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white bishop to a1 in two moves',
    translatedDescription: 'Bringe den weißen Läufer in zwei Zügen nach a1.',
    hashCode:
      'c7ab365dd195a657c5ff74c3889b57cb5bb796a9fcc2b74c47e85467c1e3a7cc',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white bishop to h1 in two moves',
    translatedDescription: 'Bringe den weißen Läufer in zwei Zügen nach h1.',
    hashCode:
      '0a90da4e0eaf4cccfb258be5c24baf0a87886580bcbecd0eb9d620190d21706b',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white bishop to a8 in two moves',
    translatedDescription: 'Bringe den weißen Läufer in zwei Zügen nach a8.',
    hashCode:
      '085b55e23674f1b675aaffcd7ec59b9bf0e92ff4e9431009e0f8f996b2c28fb2',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white bishop to h8 in two moves',
    translatedDescription: 'Ziehe den weißen Läufer in zwei Zügen nach h8.',
    hashCode:
      '3a599293da3ba5f46e246dacb7e5930812c2f892b4483c3662eb2dcc58241320',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white knight to the h1 square in two moves',
    translatedDescription:
      'Bringe den weißen Springer in zwei Zügen zum Feld h1.',
    hashCode:
      '1ddf45473e9f525efa5e0b0460773fa70b16925fc3dc546e64a30bbc302047ea',
  },
  {
    target: 'ger',
    originalDescription:
      'Transfer the white knight to the a1 square in two moves',
    translatedDescription:
      'Bringe den weißen Springer in zwei Zügen zum Feld a1.',
    hashCode:
      '8d2093fafad6180b3c771ab1110b053c97eb323274f4ca5dd302ca72d4812c2c',
  },
  {
    target: 'ger',
    originalDescription:
      'Transfer the white knight to the a8 square in two moves',
    translatedDescription:
      'Bringe den weißen Springer in zwei Zügen zum Feld a8.',
    hashCode:
      'f971e790351ae16f8795d9909ad328fcedbd79aaafee3e9de77fe48379b35941',
  },
  {
    target: 'ger',
    originalDescription:
      'Transfer the white knight to the h8 square in two moves',
    translatedDescription:
      'Bringe den weißen Springer in zwei Zügen zum Feld h8.',
    hashCode:
      'f898b8b831b8cd32a2563ba5d0f7f1f7590671f15e928b7200b14f331a9288b3',
  },
  {
    target: 'ger',
    originalDescription: 'Castle kingside',
    translatedDescription: 'Rochiere kurz (Königsflügel).',
    hashCode:
      'b0bb4bc4a3f73fa0b869ceee511cf82ce98ed8abe052e4ca578b52e60e30f3c9',
  },
  {
    target: 'ger',
    originalDescription: 'Castle queenside',
    translatedDescription: 'Rochiere lang (Damenflügel).',
    hashCode:
      '56c9e1560f138d507796612428bcbe42e1ddf810e87a8cc0405238365b301e0e',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white pawn to c5 in two moves',
    translatedDescription: 'Bringe den weißen Bauern in zwei Zügen nach c5.',
    hashCode:
      '4e2c978175955b98f120e2e5bd52e39c9ebcdce079f63f9512598f671f153d93',
  },
  {
    target: 'ger',
    originalDescription: 'Promote the white pawn into a bishop in two moves',
    translatedDescription:
      'Befördere den weißen Bauern in zwei Zügen zu einem Läufer.',
    hashCode:
      'efaeb20ddce6412ab6d2a726d7a44aa285f66cf55f51a601ffe52006068ead3c',
  },
  {
    target: 'ger',
    originalDescription: 'Promote the white pawn into a knight in two moves',
    translatedDescription:
      'Befördere den weißen Bauern in zwei Zügen zu einem Springer.',
    hashCode:
      'b98814253984f8b0d8022f8cdb8d3f7b7334206cba99f5154ba103cd7c3cba64',
  },
  {
    target: 'ger',
    originalDescription: 'Promote the white pawn into a rook in two moves',
    translatedDescription:
      'Befördere den weißen Bauern in zwei Zügen zu einem Turm.',
    hashCode:
      '54e0f029464e563c5b84c0435141c18d3db74bde6d6042e2f6c1b66f894a6d0b',
  },
  {
    target: 'ger',
    originalDescription: 'Promote the white pawn into a queen in two moves',
    translatedDescription:
      'Befördere den weißen Bauern in zwei Zügen zu einer Dame.',
    hashCode:
      'fba12e7d65c6d53df545f789bb07bf1ff94426bcc2f6dffab07447d4caa06ecd',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white knight to f6 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach f6.',
    hashCode:
      'd0257cfcf0cb8eb8532fd3ad91f5497a8c3975fed554013b54c5b8e16b782650',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white knight to e4 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach e4.',
    hashCode:
      '0c4e61f410c14944de47444a6ce67f74271e4523092814bd77950ff00b6fbc34',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white knight to h7 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach h7.',
    hashCode:
      '2b6b1d8a10ca1bfc424e850d1b8283f41d5f41475c8a3bc4332df288bc2816f7',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white knight to d4 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach d4.',
    hashCode:
      '5624d9e3f4440432b66c16ec92bf35676aa20cc90716f6b8dfe8b69db1ed3a7a',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white knight to h8 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach h8.',
    hashCode:
      '53f04a9409312b2a104d2a2d9d698f639d8566d4c0fc2fae14f858072c3a8b29',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white knight to b1 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach b1.',
    hashCode:
      'ad9491064ce47805bd9569a5f849aed9b2aec549556381d325b86cde53917652',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white knight to g3 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach g3.',
    hashCode:
      '962c63804c18a35c952ef52ebef497b3beffd25b5e83601c7fc568a4a1bf77c5',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white queen to h7',
    translatedDescription: 'Ziehe die weiße Dame nach h7.',
    hashCode:
      'b6539d11101ca8f767a3f258ab413d853aa4159b3bea110805aac54f3a7ee178',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white queen to b8',
    translatedDescription: 'Ziehe die weiße Dame nach b8.',
    hashCode:
      '62c81fb5871c05ef6505b3cc688074b592a3dd792db7b2fa3c40c7ebc5dfd0c1',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white queen to d6',
    translatedDescription: 'Bringe die weiße Dame nach d6.',
    hashCode:
      '655e57be0ae671ec4d0736249f89a171509c67627051d1a377e30de1e86e2c84',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white queen to d1',
    translatedDescription: 'Ziehe die weiße Dame nach d1.',
    hashCode:
      '9b4264416d81403eea2f2f8bfb605d996ef61fb48e5af0e49c87c04b7c324afe',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white queen to g7',
    translatedDescription: 'Bringe die weiße Dame nach g7.',
    hashCode:
      'c589c5aad4d5c3bbe35d54d02e1fba0084f9508f1351faccab9e668a3e234dfb',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white queen to c6',
    translatedDescription: 'Bringe die weiße Dame nach c6.',
    hashCode:
      'd06684ed6b42f803e31f44e9d3a39d4c48125ab97db23f791dcb6e8c354f3fb4',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white queen to g1',
    translatedDescription: 'Ziehe die weiße Dame nach g1.',
    hashCode:
      '1c615ab4e2e9ac2d453c5d0d5a2af6f317b58c7ef086fd98f286a37f0ec707f0',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white queen to c1',
    translatedDescription: 'Ziehe die weiße Dame nach c1.',
    hashCode:
      '9681bb49ceadfa71b95062f95790ebbb54bd5d105f24b4aaf090a2cc4e020c7b',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white queen to a3',
    translatedDescription: 'Bringe die weiße Dame nach a3.',
    hashCode:
      '27635fa9d3093590238973a2431a57c40b2c68f7f0c129c19488ec9e10a8a993',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white queen to h4',
    translatedDescription: 'Bringe die weiße Dame nach h4.',
    hashCode:
      '7c453f9f1496614abb50fea20e3141be4feaa1fe7a4e8152a06a9d32eeea72b6',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white queen to e1',
    translatedDescription: 'Bringe die weiße Dame nach e1.',
    hashCode:
      '6d92e7ba4b24e064e6741b73933dd229bdc107f6557459da656f1cf27a03037f',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white rook to h1 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach h1.',
    hashCode:
      'c114565f592afd1a54c1a85c2664b38ef4f5f2253f8ef99b38ee3185079a49de',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white rook to a1 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach a1.',
    hashCode:
      '161bd7887c70b5b11e1418dce5e7a928d74438202ab033734a26b8f54066016a',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white rook to g8 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach g8.',
    hashCode:
      'edcb3b7b4ab8d4866796ada2ce0afb2bc33dbe6bca8d28b49e360b6311a3d246',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white rook to h4 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach h4.',
    hashCode:
      'f42c062edf85117f2588e329d036d7569fd93c37d65a96fba54dcf0a785f2a65',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white rook to h8 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach h8.',
    hashCode:
      'c83c5a8295227cfdf05490368dd7e188310fad2742823d4585020ba7c6981e49',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white king to a6 in the shortest way',
    translatedDescription:
      'Bringe den weißen König auf dem kürzesten Weg nach a6.',
    hashCode:
      '3046d0ccb10ed8adaca59be52386c63dc1d10671de7aa784eb9a5f676f5934bc',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white king to a1 on the shortest way',
    translatedDescription:
      'Bringe den weißen König auf dem kürzesten Weg nach a1.',
    hashCode:
      '11d5584d9c925feaac743d0ba5d1c5436085bcb47f1db6b0aa7ec445e5dcebf6',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white king to a2 on the shortest way',
    translatedDescription:
      'Bringe den weißen König auf dem kürzesten Weg nach a2.',
    hashCode:
      'd5edd73585b8ffa39faffdc2946097213059d87944171b08d1313c43a1637831',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white king to h8 on the shortest way',
    translatedDescription:
      'Bringe den weißen König auf dem kürzesten Weg nach h8.',
    hashCode:
      '204a474ad9c237d5aa0383fd748b87a6db0545aa4dca5efb12d4fee2fec31927',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white bishop to c2 in two moves',
    translatedDescription: 'Bringe den weißen Läufer in zwei Zügen nach c2.',
    hashCode:
      '5baa77a1828ae75411c5bd55304644307b17c8992bc26232357dbd3ab3957a99',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white bishop to b8 in two moves',
    translatedDescription: 'Bringe den weißen Läufer in zwei Zügen nach b8.',
    hashCode:
      '243119408efb1eb774bd8e106b09d49ed7d5ca3312543f1487e478e53d6cf25b',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white bishop to b4 in two moves',
    translatedDescription: 'Bringe den weißen Läufer in zwei Zügen nach b4.',
    hashCode:
      '7fcb48fa001b4109aa1be601d2224250005b6b395e5db8eb412e22ab232cd173',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white bishop to a3 in two moves',
    translatedDescription: 'Bringe den weißen Läufer in zwei Zügen nach a3.',
    hashCode:
      'c89769aedd5b5fef3240daf9fee26789e38de5c4ffaf49f9683e3b4e5751bd42',
  },
  {
    target: 'ger',
    originalDescription: 'Castle to the kingside',
    translatedDescription: 'Führe die kurze Rochade (Königsflügel) aus.',
    hashCode:
      '441aef63ac657ecfa249dfd966e75db01fa2f538e9f51484de0f5ae9d1d45821',
  },
  {
    target: 'ger',
    originalDescription: 'Castle to the queenside',
    translatedDescription: 'Führe die lange Rochade (Damenflügel) aus.',
    hashCode:
      '8547c3c74ea7b71ea0c65e1887cd118ffbc229e8ec545382cb45b9c0b058829f',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white pawn two squares forward',
    translatedDescription: 'Ziehe den weißen Bauern zwei Felder vor.',
    hashCode:
      'c27e8471756df8a2226118918741345d0f538b447cf284b5876a87266d863f48',
  },
  {
    target: 'ger',
    originalDescription: 'Promote the white pawn into a rook',
    translatedDescription: 'Befördere den weißen Bauern zu einem Turm.',
    hashCode:
      '6287ba5645cd3a41927c99dfd416d769761e3a95b60320cc93af7fb27e6f547e',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white rook to d3 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach d3.',
    hashCode:
      'deda684eeac590b5158a04b6731c551358ca9b3a4681e7f4ed3108ece5afa2d7',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white rook to c1 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach c1.',
    hashCode:
      '913ccb9ed2a86fae102750b5e30d44b90a5a59a3e3567c38f97a96589ed23a8b',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white rook to c6 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach c6.',
    hashCode:
      '55c7147e6f2e15f092827fb292c5aff88cb74b2a291ba673c7882f94bf82a902',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white rook to h6 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach h6.',
    hashCode:
      '66bd2f5dd8ae14c5c1b9d9a22fe81c4db3fd40e4536954a2365aa4459fe11321',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white rook to g2 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach g2.',
    hashCode:
      'e5d5c26d151f1bcf379d0395719459f42e47acad9d72a50c133093d5c8d4487d',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white rook to e7 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach e7.',
    hashCode:
      '1db265ae522f494d2daad3cfd4d652cad7fb42a8b5a6700807071c726c169318',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white rook to e4 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach e4.',
    hashCode:
      '396cc4e56c43bf4da8dfa3ad296dbcd623351e8dcadbc1f1c757405c6e57fa90',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white rook to a5 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach a5.',
    hashCode:
      '8c8f47b3d1c1284dec81e761f94539d8b227c87e2d06f88520db53aa023b5535',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white rook to b8 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach b8.',
    hashCode:
      'ce7fe02192416b1ed0c5fe55a2694c766a2534333c1ed164771b3f36f79cc547',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white rook to c1 in two moves',
    translatedDescription: 'Bringe den weißen Turm in zwei Zügen nach c1.',
    hashCode:
      'e728e3bc92cad22a5ed064649259ce95a21233b8056c7d6212021d71a41cfd37',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white bishop to e8 in two moves',
    translatedDescription: 'Bringe den weißen Läufer in zwei Zügen nach e8.',
    hashCode:
      '360a53c72b8c83a056508cec8cabe8f4091911d92a587c081ca3c11bd55f719a',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white bishop to g8 in two moves',
    translatedDescription: 'Bringe den weißen Läufer in zwei Zügen nach g8.',
    hashCode:
      'dd000345c8352fa519b9ea1495b4079cf434c9ed7abb6e9d20c2794939d9796e',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white bishop to f8 in two moves',
    translatedDescription: 'Bringe den weißen Läufer in zwei Zügen nach f8.',
    hashCode:
      '06f9f6694ef7bdfb3a6eb72ef806659b9c3430ee320b147f61a683774ff258d6',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white bishop to a1 in two moves',
    translatedDescription: 'Ziehe den weißen Läufer in zwei Zügen nach a1.',
    hashCode:
      'a98e6d8c21f6fc8857d3d283ef944a5f7371e39b3faab63a956d663d721248a9',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white bishop to a3 in two moves',
    translatedDescription: 'Ziehe den weißen Läufer in zwei Zügen nach a3.',
    hashCode:
      'e6da27d5cb2eb17671262ffa84ed317f535b850bab7683123bae3ff20a7d3d4e',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white bishop to d8 in two moves',
    translatedDescription: 'Ziehe den weißen Läufer in zwei Zügen nach d8.',
    hashCode:
      '8ce13a9b7d39b95450f0635a67ee8c8025845f9d604e1f4d56c13a1e9db7361b',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white bishop to f7 in two moves',
    translatedDescription: 'Bringe den weißen Läufer in zwei Zügen nach f7.',
    hashCode:
      '83aba58a9ac031c0d0cbfbe989112899aa5705164d97530598c7a0aa102f99ff',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white bishop to c2 in two moves',
    translatedDescription: 'Bringe den weißen Läufer in zwei Zügen nach c2.',
    hashCode:
      'dce2630ce2452c3b73a4695738e6ce2a83f35d15ba27ca2c66960fdbb31b0a2b',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white bishop to h4 in two moves',
    translatedDescription: 'Ziehe den weißen Läufer in zwei Zügen nach h4.',
    hashCode:
      'add4aa7868370836ac9e01afbae335dcae88a38cf76a78494f9cff1c19f1cd00',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white knight to e1 in two moves',
    translatedDescription: 'Ziehe den weißen Springer in zwei Zügen nach e1.',
    hashCode:
      'a7d9fb79f66e62e9ffecb8c90bddb3451d2847253ce048827e4d184b076f5a84',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white knight to h8 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach h8.',
    hashCode:
      '9199e45bdcb5415ffdb4c6ce79e09f7fea732398cc568187813451191e16be8a',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white knight to c6 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach c6.',
    hashCode:
      '5df8b4e5c499d732408788bc10cfc51f80c5aeb8173ed3ee5e67ae84b389af4e',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white knight to a2 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach a2.',
    hashCode:
      'd2645b0fe6d585bc3b3efdee1c1ab224c524f5f94d83754de32e04225a420aaf',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white knight to h1 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach h1.',
    hashCode:
      '38d6a8498e8d66ed70aae238eb450efcd847297888933d0e8a00dde6f9e71377',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white knight to c3 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach c3.',
    hashCode:
      'de5ccf1f1c12163308cfdab8e60971e23058053897f182f22410a5e927e7b364',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white knight to b6 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach b6.',
    hashCode:
      '4f70e89a823fab5d1fcc41f562c58ca6f661e36a0f63b0a34a1e7b6283a95706',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the white knight to g7 in two moves',
    translatedDescription: 'Bringe den weißen Springer in zwei Zügen nach g7.',
    hashCode:
      '77c34999a27097d842e783bc53f3ccd92bad6920687028eeaf6fa5bee28f1b6e',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white queen to h4',
    translatedDescription: 'Ziehe die weiße Dame nach h4.',
    hashCode:
      '76850613edf6d20c63a2e767c6d64f07dbb6368d3afe4d1c6e56cf96869c44f7',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white queen to h6',
    translatedDescription: 'Ziehe die weiße Dame nach h6.',
    hashCode:
      '7a74c882a94f294ecb8bdfe5edf0b8c5f92a6fd7c7833215a7cc926499684306',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white queen to g8',
    translatedDescription: 'Ziehe die weiße Dame nach g8.',
    hashCode:
      '21ed6d3962d028bd98e783644ba9bee62f9fd00ec027f663b5822a83ccd68667',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white queen to c6',
    translatedDescription: 'Ziehe die weiße Dame nach c6.',
    hashCode:
      '41d5d9362ac60c8f1043c1fc202700267406794e6826f7ce0256572e2ff230e9',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white queen to g5',
    translatedDescription: 'Ziehe die weiße Dame nach g5.',
    hashCode:
      '845dc26339b76a654acd935f987824539ce28970dda7519863694231bb5edee3',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white queen to e8',
    translatedDescription: 'Ziehe die weiße Dame nach e8.',
    hashCode:
      'e985f59afdb74532d97e6ac143cecb0c01742ea6e71d58255c422d0a02bed62b',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white queen to c8',
    translatedDescription: 'Ziehe die weiße Dame nach c8.',
    hashCode:
      '9bd285d86a7eeef6f464e46482f82f7285be24d9429efdcdaca3ccf3986b0ce3',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white queen to a7',
    translatedDescription: 'Ziehe die weiße Dame nach a7.',
    hashCode:
      '86225f722a8f460b3c2b4fb7b03a8aabd09369d4e29759f3be3e29ad99fa0c07',
  },
  {
    target: 'ger',
    originalDescription: 'Promote the white pawn into a queen',
    translatedDescription: 'Befördere den weißen Bauern zu einer Dame.',
    hashCode:
      '76cb1d23eebf900b63a393fb1f03c8bf7c6b662759081c761124dc30ef342d9c',
  },
  {
    target: 'ger',
    originalDescription: 'Promote the white pawn into a bishop',
    translatedDescription: 'Befördere den weißen Bauern zu einem Läufer.',
    hashCode:
      '42309ab7cc6307870522c0f3753eae5cb7b48b8427e0131f46e814f42621d581',
  },
  {
    target: 'ger',
    originalDescription: 'Move the white rook to e8',
    translatedDescription: 'Ziehe den weißen Turm nach e8.',
    hashCode:
      '9040a9fc4742e3453d364f9f4ef3bb58757b6d80394545bac895fd4895256c94',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white bishop to b6',
    translatedDescription: 'Bringe den weißen Läufer nach b6.',
    hashCode:
      'ab6c6aa60dcd5926c2ada88212d6e1bd8ade731d61873054c5ce80ee7ff62e68',
  },
  {
    target: 'ger',
    originalDescription: 'Give a check with the queen on g5',
    translatedDescription: 'Setze mit der Dame auf g5 Schach.',
    hashCode:
      'b4eddd85ba669f94da09ed39cff90d86d66c71264515f3d5b5f1f1106a2e09a8',
  },
  {
    target: 'ger',
    originalDescription: 'Transfer the knight to a8 in the shortest way',
    translatedDescription: 'Bringe den Springer auf dem kürzesten Weg nach a8.',
    hashCode:
      'f83224f79a3434c38efcb94fa5eef61ed1f4347faa7f323d15be3a0dc13a9afb',
  },
  {
    target: 'ger',
    originalDescription: 'Get the rook to h8 in two moves',
    translatedDescription: 'Bringe den Turm in zwei Zügen nach h8.',
    hashCode:
      '22840efc82d519abb57d369a6f4c7cae53bb357478ca14543824c8e9e7e26a01',
  },
  {
    target: 'ger',
    originalDescription: 'Promote the pawn into a queen',
    translatedDescription: 'Befördere den Bauern zu einer Dame.',
    hashCode:
      '13bde0a07ebe105db39e271a25df3bc5c31253da2c7fa3acd92c2577ea0842eb',
  },
  {
    target: 'ger',
    originalDescription: 'Promote the pawn into a rook',
    translatedDescription: 'Befördere den Bauern zu einem Turm.',
    hashCode:
      'd4e47deffcaa08cd539a8375b34c004c586e7334b537f6f72c1ba1f895d02488',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white king to e3 in two moves',
    translatedDescription: 'Bringe den weißen König in zwei Zügen nach e3.',
    hashCode:
      '6360efb1cfae2840a9692d2c874bdeb6aefd78710507089acfa2f7b508bf9495',
  },
  {
    target: 'ger',
    originalDescription: 'Get the king to g3 in two moves',
    translatedDescription: 'Bringe den König in zwei Zügen nach g3.',
    hashCode:
      '789bce3994e448266f441b883da0407c3fd1a17ce3625b19ce09564a5c5c26e1',
  },
  {
    target: 'ger',
    originalDescription: 'Give a check to the black king in one move',
    translatedDescription: 'Setze den schwarzen König in einem Zug Schach.',
    hashCode:
      '8653846f48674e500a9b62efcd70690736d7fe2905fbc853a26e32b1a06b18b2',
  },
  {
    target: 'ger',
    originalDescription: 'Get the white king to a2 in two moves',
    translatedDescription: 'Bringe den weißen König in zwei Zügen nach a2.',
    hashCode:
      'b727eb1be8e2714dba7db3f39e6d137b8b910fc7b043a5795b699ccc52a5ba81',
  },
  {
    target: 'ger',
    originalDescription:
      "In this chapter, we are going to solve mate in one\nmove problems. Checkmate occurs in a position in which a player's king is\ndirectly attacked by an opponent's piece or pawn and has no possible move to\nescape the check. There are three escaping possibilities: Going out from the\ncheck with the king, capturing the piece which gives the check, moving a piece\nin-between the king and the piece which gives the check. If none of them is\npossible, the side who gives the checkmate wins the game.\n\nThere is no way to escape from the check, therefore it is checkmate.",
    translatedDescription:
      'In diesem Kapitel werden wir Matt-in-einem-Zug-Probleme lösen. Schachmatt tritt in einer Stellung ein, in der der König eines Spielers direkt von einer gegnerischen Figur oder einem Bauern angegriffen wird und keinen möglichen Zug hat, um dem Schach zu entkommen. Es gibt drei Fluchtmöglichkeiten: Mit dem König aus dem Schachfeld ziehen, die schachbietende Figur schlagen oder eine Figur zwischen den König und die schachbietende Figur ziehen. Wenn keine davon möglich ist, gewinnt die Seite, die Schachmatt gibt, die Partie.\n\nEs gibt keine Möglichkeit, dem Schach zu entkommen, daher ist es Schachmatt.',
    hashCode:
      '7c1eaca0aedfa678a0bc61d4850c16b9f82927f39d3be41e18303fe93c043da6',
  },
  {
    target: 'ger',
    originalDescription:
      'White to move and checkmate in one move!\n\nDoublecheck and checkmate! White gives two checks\nin the same time by the rook and the knight. Both pieces could be taken but\nthe other one keeps the king in check, therefore it is not possible. The only\nescape would be the move out from the check with the king, but no squares are\navailable.',
    translatedDescription:
      'Weiß am Zug und matt in einem Zug!\n\nDoppelschach und matt! Weiß gibt gleichzeitig zwei Schachgebote durch Turm und Springer. Beide Figuren könnten geschlagen werden, aber die jeweils andere hält den König im Schach, daher ist es nicht möglich. Die einzige Fluchtmöglichkeit wäre, mit dem König aus dem Schachfeld zu ziehen, aber es sind keine Felder verfügbar.',
    hashCode:
      '311080cff70dce39b1310588219c32985fcfa49887d64c6c3d46bc39214dbfd8',
  },
  {
    target: 'ger',
    originalDescription:
      'Doublecheck and\ncheckmate again! White gives two checks in the same time, which means that is\nnot possible to take any of the pieces despite they are hanging and the king\nhas no square to leave. Doublecheck is a very strong weapon in chess. We\nalways need to pay attention for such possibilities. In this chapter you need\nto deliver checkmates with the help of a doublecheck.',
    translatedDescription:
      'Wieder Doppelschach und matt! Weiß gibt gleichzeitig zwei Schachgebote, was bedeutet, dass keine der Figuren geschlagen werden kann, obwohl sie ungedeckt sind, und der König kein Feld zum Wegziehen hat. Doppelschach ist eine sehr starke Waffe im Schach. Wir müssen stets auf solche Möglichkeiten achten. In diesem Kapitel musst du mit Hilfe eines Doppelschachs mattsetzen.',
    hashCode:
      '4276a3a80fc2393d48426d053f4df5a3e3d319dde93e86919eb999f7d348aaf9',
  },
  {
    target: 'ger',
    originalDescription: 'Mate with doublecheck',
    translatedDescription: 'Matt durch Doppelschach.',
    hashCode:
      'fda570436143ded31953c2d93b9bdad32ca31ae95aa9898b66e4738fecc112be',
  },
  {
    target: 'ger',
    originalDescription: 'Smiley',
    translatedDescription: 'Smiley',
    hashCode:
      'f424040f5afd8846f2948293acf1f499a502d081f49937bb4cf252d146a3d19e',
  },
  {
    target: 'ger',
    originalDescription:
      'Pin is one of the most common motifs in chess. A\npin is a situation brought on by an attacking piece in which a defending piece\ncannot move without exposing a more valuable defending piece on its other side\nto capture by the attacking piece. In this current position the b7 pawn is\npinned by the bishop on h1 as it cannot leave its position because the king on\na8 remains under attack. Therefore White can deliver mate in one move by\nplaying\n\nThe king has no square to escape and the pawn is pinned.',
    translatedDescription:
      'Die Fesselung ist eines der häufigsten Motive im Schach. Eine Fesselung ist eine Situation, die durch eine angreifende Figur hervorgerufen wird, in der eine verteidigende Figur sich nicht bewegen kann, ohne eine wertvollere verteidigende Figur auf ihrer anderen Seite dem Schlagen durch die angreifende Figur preiszugeben. In der aktuellen Stellung ist der b7-Bauer durch den Läufer auf h1 gefesselt, da er seine Position nicht verlassen kann, weil der König auf a8 unter Angriff bleibt. Daher kann Weiß in einem Zug Matt setzen, indem er zieht.\n\nDer König hat kein Fluchtfeld und der Bauer ist gefesselt.',
    hashCode:
      '92781f14f98eeb6cc1a0eb00fddaed7a7f79942de2ade51590c071ffb6755e92',
  },
  {
    target: 'ger',
    originalDescription:
      'The e5 bishop is pinned now by the rook on b5 as\nit cannot move because the h5 king remains unprotected. Black attacks the\nbishop with two pieces and it seems like he is going to win it. However, the\ng7 bishop is also pinned by the e5 bishop as the king on h8 gets under attack.\nWhite can make use of it by playing\n\nCheckmate! In this chapter, you\nneed to deliver similar checkmates in one move making use of a pin in more and\nmore difficult positions.',
    translatedDescription:
      'Der Läufer auf e5 ist nun durch den Turm auf b5 gefesselt, da er sich nicht bewegen kann, weil der König auf h5 ungedeckt bleibt. Schwarz greift den Läufer mit zwei Figuren an und es scheint, als würde er ihn gewinnen. Allerdings ist der Läufer auf g7 auch durch den Läufer auf e5 gefesselt, da der König auf h8 unter Angriff gerät. Weiß kann dies ausnutzen, indem er zieht.\n\nSchachmatt! In diesem Kapitel musst du ähnliche Mattführungen in einem Zug ausführen, indem du eine Fesselung in immer schwierigeren Stellungen nutzt.',
    hashCode:
      '9bd3b13da0ec3b94f735584bb96e7b04eda2569f71c1b40620af6ae07726aab7',
  },
  {
    target: 'ger',
    originalDescription: 'Mate using the pin',
    translatedDescription: 'Matt unter Ausnutzung einer Fesselung.',
    hashCode:
      '3537bf081782d03b84729d0f7051b5aacb53b7e2b9a47bd828bb7675d4a7ccf4',
  },
  {
    target: 'ger',
    originalDescription: 'Give mate in one move!',
    translatedDescription: 'Setze in einem Zug matt!',
    hashCode:
      'dd8e477c2302cba1547b12b9ee43bf911028e05421eea845bf00caeb4c383621',
  },
  {
    target: 'ger',
    originalDescription:
      'Moves: One square in\nany direction — up, down, sideways, or diagonally.   • In the opening and\nmiddlegame, the king needs to be protected (usually by castling).   • In the\nendgame, the king becomes active and helps support pawns or control key\nsquares.  Value: Priceless — if you lose the king, you lose the game.',
    translatedDescription:
      'Züge: Ein Feld in jede Richtung – vor, zurück, seitwärts oder diagonal.   • In der Eröffnung und im Mittelspiel muss der König geschützt werden (üblicherweise durch Rochade).   • Im Endspiel wird der König aktiv und hilft, Bauern zu unterstützen oder Schlüsselfelder zu kontrollieren.  Wert: Unersetzlich – verlierst du den König, verlierst du die Partie.',
    hashCode:
      'd234ebcb46770f94a004bf5ce361b8a07e156d862224636755f913bd8b206bae',
  },
  {
    target: 'ger',
    originalDescription:
      'Moves: Any number of squares\nin a straight line — vertically, horizontally, or diagonally.  When it’s\nstrong:   • Very powerful in the middlegame and endgame, especially in open\npositions.   • Best placed in the center, where it controls many squares.  \n• Usually not moved early in the opening to avoid being attacked.  Value:\nAbout 9 pawns.',
    translatedDescription:
      'Züge: Beliebig viele Felder in gerader Linie – vertikal, horizontal oder diagonal.  Stärken:   • Sehr stark im Mittel- und Endspiel, besonders in offenen Stellungen.   • Am besten im Zentrum platziert, wo sie viele Felder kontrolliert.   • Wird in der Eröffnung normalerweise nicht früh gezogen, um keinen Angriffen ausgesetzt zu sein.  Wert: Etwa 9 Bauern.',
    hashCode:
      '1b3f4e42f2a5522ae7dfb2fbf791bd8a045a1ed17a69c2c873dabb29896c6e32',
  },
  {
    target: 'ger',
    originalDescription:
      'Moves: Any number of squares vertically or\nhorizontally.  When it’s strong:   • Works best in the endgame and on open\nor semi-open files.   • Two rooks together (doubled rooks) can be very\ndangerous.   • Often used to attack the opponent’s back rank or support\npassed pawns.  Value: About 5 pawns.',
    translatedDescription:
      'Züge: Beliebig viele Felder vertikal oder horizontal.  Stärken:   • Funktionieren am besten im Endspiel und auf offenen oder halboffenen Linien.   • Zwei Türme zusammen (Doppeltürme) können sehr gefährlich sein.   • Werden oft genutzt, um die Grundreihe des Gegners anzugreifen oder Freibauern zu unterstützen.  Wert: Etwa 5 Bauern.',
    hashCode:
      '7eaf52fe9774da01c51b85e0905bb7b695b8b0cf2dedb328e49987c83e062d37',
  },
  {
    target: 'ger',
    originalDescription:
      'Moves: Any number of squares diagonally, but\nonly on one color for the whole game.  When it’s strong:   • Strong in\nopen positions, where it has long diagonals to move.   • Two bishops\ntogether (the bishop pair) is a strong combination.   • Very useful in\nendgames, especially on both sides of the board.  Value: 3 pawns.',
    translatedDescription:
      'Züge: Beliebig viele Felder diagonal, aber nur auf einer Farbe während der gesamten Partie.  Stärken:   • Stark in offenen Stellungen, wo sie lange Diagonalen zur Verfügung haben.   • Zwei Läufer zusammen (das Läuferpaar) sind eine starke Kombination.   • Sehr nützlich im Endspiel, besonders auf beiden Seiten des Brettes.  Wert: 3 Bauern.',
    hashCode:
      'd0a4cfc56a19f9b1a4b15718a020bf68ce243573538c76d2d5e87c179eed5c7d',
  },
  {
    target: 'ger',
    originalDescription:
      'Moves: In an L-shape — two squares in one direction, then one square to the\nside; can jump over pieces.  When it’s strong:   • Great in closed\npositions where other pieces are blocked.   • Very strong on outposts,\nespecially in the center.   • In endgames, it can be a bit slow compared to\nbishops.  Value: About 3 pawns.',
    translatedDescription:
      'Züge: In L-Form – zwei Felder in eine Richtung, dann ein Feld zur Seite; können über Figuren springen.  Stärken:   • Hervorragend in geschlossenen Stellungen, wo andere Figuren blockiert sind.   • Sehr stark auf Stützpunkten, besonders im Zentrum.   • Im Endspiel können sie im Vergleich zu Läufern etwas langsam sein.  Wert: Etwa 3 Bauern.',
    hashCode:
      '75bd6e2bc39929f07341ede5d5ac7afda78ca94d22c93ce616b361acea9b63a6',
  },
  {
    target: 'ger',
    originalDescription:
      'Moves: One square forward (or two squares on its first move);\ncaptures one square diagonally.  When it’s strong:   • In the opening, it\nhelps control the center and opens lines for your pieces.   • In the\nmiddlegame, it can create strong structures or passed pawns.   • In the\nendgame, it can promote to a queen or other piece if it reaches the last rank.\nValue: 1 pawn, but a passed pawn can become very powerful.',
    translatedDescription:
      'Züge: Ein Feld vorwärts (oder zwei Felder bei seinem ersten Zug); schlägt ein Feld diagonal.  Stärken:   • In der Eröffnung hilft er, das Zentrum zu kontrollieren und Linien für die Figuren zu öffnen.   • Im Mittelspiel kann er starke Bauernformationen oder Freibauern schaffen.   • Im Endspiel kann er zu einer Dame oder anderen Figur umgewandelt werden, wenn er die letzte Reihe erreicht.\nWert: 1 Bauer, aber ein Freibauer kann sehr mächtig werden.',
    hashCode:
      '34d68020dd0fe53667db317e895124037de5e4926b740ce5539bc81a99b7ab81',
  },
  {
    target: 'ger',
    originalDescription: 'Win the black pawn !',
    translatedDescription: 'Gewinne den schwarzen Bauern!',
    hashCode:
      'cd874ae2a297ef721ed76c95831dee7c4de2188870fe9dac3327815b6418b02b',
  },
  {
    target: 'ger',
    originalDescription: 'Win material in one move!',
    translatedDescription: 'Erziele in einem Zug einen Materialgewinn!',
    hashCode:
      '45c5d42aa45464c2877fdffb53f473590ba5bf1645dd4002f3ed8dc0ef8e8fa9',
  },
  {
    target: 'ger',
    originalDescription: 'Capture the black rook!',
    translatedDescription: 'Schlage den schwarzen Turm!',
    hashCode:
      '9d9b95506b26b74c962463e757cb1ad1e6310bf2afecbfa666d288e86383a94f',
  },
  {
    target: 'ger',
    originalDescription: 'Grab the pawn!',
    translatedDescription: 'Schnapp dir den Bauern!',
    hashCode:
      '753151dd0e85d5970b85dd328e3ae412d0e836c6433d686aee869c6a0be7d263',
  },
  {
    target: 'ger',
    originalDescription: 'Capture the queen!',
    translatedDescription: 'Schlage die Dame!',
    hashCode:
      '7e9e72b76315dc33002f6b0994b2eb91b8a58c14cf273a68ba14f0378d3e71ae',
  },
  {
    target: 'ger',
    originalDescription: 'Avoid the promotion of the pawn!',
    translatedDescription: 'Verhindere die Umwandlung des Bauern!',
    hashCode:
      '6af4fbfa4b43521f2342d3f54edb8cc3b630f22e119e184a63b66a4e332feb52',
  },
  {
    target: 'ger',
    originalDescription: 'Take the pawn!',
    translatedDescription: 'Nimm den Bauern!',
    hashCode:
      '090caee1d8a2434fb68d32820a4cb12ae8ed175e00a11bca1f0eb826cca8d374',
  },
  {
    target: 'ger',
    originalDescription: 'Trade off the rooks!',
    translatedDescription: 'Tausche die Türme ab!',
    hashCode:
      '5187b3e3c3b36565f8533c5c9ad08397250e52c6c237a436194aacca5acc6494',
  },
  {
    target: 'ger',
    originalDescription: 'Capture the knight!',
    translatedDescription: 'Schlage den Springer!',
    hashCode:
      '74fa7bcc3b0bf0c385fb6ce48e60948fe05312c3e59d4a93f7a828c8b5f02200',
  },
  {
    target: 'ger',
    originalDescription: 'Grab the black pawn!',
    translatedDescription: 'Schnapp dir den schwarzen Bauern!',
    hashCode:
      '0c88872ebe6be358e4a2a0c346f967263fe76068b19d9d57d110aca331c8110c',
  },
  {
    target: 'ger',
    originalDescription: 'Capture the pawn, which gives you check!',
    translatedDescription: 'Schlage den Bauern, der dir Schach gibt!',
    hashCode:
      '8a8f04f8e88bf1370263c2b73baccca03499fd365f180c52ae952786b830d303',
  },
  {
    target: 'ger',
    originalDescription: 'Capture that piece, which gives you check!',
    translatedDescription: 'Schlage die Figur, die dir Schach gibt!',
    hashCode:
      '6d109e1b8dfffc408c9957ec1676f772da5c97435095298346a813fa6716b135',
  },
  {
    target: 'ger',
    originalDescription: 'Take that piece, which one you can!',
    translatedDescription: 'Nimm die Figur, die du nehmen kannst!',
    hashCode:
      '00a5712801ee8efd199951954fa006b3d662ae97795b0d8260083a9cce4b42b8',
  },
  {
    target: 'ger',
    originalDescription: 'Take the piece with higher value!',
    translatedDescription: 'Nimm die Figur mit dem höheren Wert!',
    hashCode:
      'de47bc2056b02c1362470b035bdaff5512794869542afe689860227a9058f147',
  },
  {
    target: 'ger',
    originalDescription: 'Win material and promote the pawn to queen!',
    translatedDescription:
      'Erziele Materialgewinn und befördere den Bauern zur Dame!',
    hashCode:
      '349557188d0316d973acb3a2a63467d5ba874cdd074980844b758992eb04529a',
  },
  {
    target: 'ger',
    originalDescription: 'Capture the Black queen!',
    translatedDescription: 'Schlage die schwarze Dame!',
    hashCode:
      '1dc585755b828b21849ab254de81ec4a49bd52fb1a9cb338706e9542cef5418c',
  },
  {
    target: 'ger',
    originalDescription: 'Grab the queen!',
    translatedDescription: 'Schnapp dir die Dame!',
    hashCode:
      'f0924d9f586248cc029375091d29d370dccd1a0c1c1bb92935af51cacdda9e43',
  },
  {
    target: 'ger',
    originalDescription: 'Get rid of the queen!',
    translatedDescription: 'Werde die Dame los!',
    hashCode:
      '52f01fbc5591856797d7ad5c74bbff25a5d1a80597cac4fcaf3c8f2f85a27bd2',
  },
  {
    target: 'ger',
    originalDescription: 'Catch the pawn!',
    translatedDescription: 'Fang den Bauern!',
    hashCode:
      '4d1c81939c623e89b004b52c266ef27fd814ad05f14020679473084955d077d5',
  },
  {
    target: 'ger',
    originalDescription: 'Take and promote the pawn to queen!',
    translatedDescription: 'Nimm den Bauern und befördere ihn zur Dame!',
    hashCode:
      '5ed0495c244a5998363154faba1f15760bd3b488e80c202ca56f58bedbe6acc5',
  },
  {
    target: 'ger',
    originalDescription: 'Take the piece, which gives you check!',
    translatedDescription: 'Schlage die Figur, die dir Schach gibt!',
    hashCode:
      '3c35acfec98bb3ef3e179783400248a0ef86dafb052ef14f2ddcbd76a3018036',
  },
  {
    target: 'ger',
    originalDescription: 'Take the queen!',
    translatedDescription: 'Nimm die Dame!',
    hashCode:
      '5e9ccc5b10e86aba2d12765466b9dd98828e7c90a062968c79f73fa7c37c4b87',
  },
  {
    target: 'ger',
    originalDescription: 'Take the rook!',
    translatedDescription: 'Nimm den Turm!',
    hashCode:
      '073fafb7252b98cc729b562072cfa603148c00708c2152a718eaf77446af982f',
  },
  {
    target: 'ger',
    originalDescription: 'Capture the pawn!',
    translatedDescription: 'Schlage den Bauern!',
    hashCode:
      '7137cd8f006577ed1b5416c5093de9d1ab4b7fed38ebb83b6b0edc3308174a9e',
  },
  {
    target: 'ger',
    originalDescription: 'Trade off the queens!',
    translatedDescription: 'Tausche die Damen ab!',
    hashCode:
      'f9dfcaf1a658f6f7b412ba8273c63e9519ea8562c405aee6acf0e70c9ee20565',
  },
  {
    target: 'ger',
    originalDescription: 'Take the stronger piece!',
    translatedDescription: 'Nimm die stärkere Figur!',
    hashCode:
      '8f3b2d5d53f6d4001796e7067a66557e064158fa9eb47928232882b0b47f1d08',
  },
  {
    target: 'ger',
    originalDescription: 'Trade queens!',
    translatedDescription: 'Tausche die Damen!',
    hashCode:
      '2eed3d5041d3bc02278863d024c6eba05d8bbef9aebdea27c49ecaed3e61c5ee',
  },
  {
    target: 'ger',
    originalDescription: 'Take the piece, which gives you the check!',
    translatedDescription: 'Schlage die Figur, die dir das Schach gibt!',
    hashCode:
      '8b6f63405b3a95a96770a60ae05f7119ef07a20fed314fdd5ab70655dfb78f2e',
  },
  {
    target: 'ger',
    originalDescription: 'Take the pawn and then promote it to queen!',
    translatedDescription: 'Nimm den Bauern und befördere ihn dann zur Dame!',
    hashCode:
      '9d1d1ab1f0385ade277e85192e49b5dfd24f74a8c82122ce6ea0bb205fdf7fd7',
  },
  {
    target: 'ger',
    originalDescription:
      'In the 3rd Chapter we already got familiar with the pin. There we delivered\ncheckmates in one move with the help of a pin while now we need to try to find\nthe way to win material with this motif.\n\nWhite takes the rook\nnext move as it is pinned and cannot move.',
    translatedDescription:
      'Im 3. Kapitel haben wir bereits die Fesselung kennengelernt. Dort haben wir mit Hilfe einer Fesselung in einem Zug Matt gesetzt, während wir nun versuchen müssen, mit diesem Motiv Material zu gewinnen.\n\nWeiß nimmt den Turm im nächsten Zug, da er gefesselt ist und sich nicht bewegen kann.',
    hashCode:
      'caeaef0a0c0fc6f15b8a6c3e570baa0a09a922c23e92c01a5703dcba3f42ebc9',
  },
  {
    target: 'ger',
    originalDescription:
      'Black has material advantage for the moment but after\n\nWhite wins\nthe queen with his rook as it cannot leave because of the pin. The same is\ntrue on the opposite way, the rook is also pinned, but of course this deal\nfavors White as the queen gets lost and it is more valuable than the rook. Try\nto solve the following exercises with the help of a pin.',
    translatedDescription:
      'Schwarz hat momentan einen Materialvorteil, aber nach\n\ngewinnt Weiß die Dame mit seinem Turm, da sie aufgrund der Fesselung nicht wegziehen kann. Dasselbe gilt umgekehrt: Der Turm ist ebenfalls gefesselt, aber natürlich begünstigt dieser Tausch Weiß, da die Dame verloren geht und wertvoller als der Turm ist. Versuche, die folgenden Aufgaben mit Hilfe einer Fesselung zu lösen.',
    hashCode:
      '4b719a65d24392d2d6547b6d55fe15ab85537ff25f45f4a38471f5903e099463',
  },
  {
    target: 'ger',
    originalDescription: 'Try to win material!',
    translatedDescription: 'Versuche, Material zu gewinnen!',
    hashCode:
      'cf0106cd69d789c0f9650899e7298d05a684171e9d361a8367a289846c2aefcb',
  },
  {
    target: 'ger',
    originalDescription:
      'White to move and give mate in two moves!\n\nA\npicturesque checkmate! With the great queen sacrifice in the first move, White\nhas squeezed the black king into the corner and the knight gave mate! This is\ncalled smothered mate as the king cannot move because of his own pieces. We\nshould remember well this motif because this is the most common way to deliver\nsmothered mates.',
    translatedDescription:
      'Weiß am Zug und setze in zwei Zügen matt!\n\nEin\nbildhübsches Schachmatt! Mit dem großartigen Damenopfer im ersten Zug hat Weiß\nden schwarzen König in die Ecke gedrängt und der Springer setzte Matt! Dies wird\nersticktes Matt genannt, da der König sich wegen seiner eigenen Figuren nicht bewegen kann. Wir\nsollten uns dieses Motiv gut einprägen, denn dies ist die häufigste Art, ein\nersticktes Matt zu erreichen.',
    hashCode:
      '2ee25fc07456927e0d3756e3a5f449a1e25baadaf77c9eccb950abf21aa01727',
  },
  {
    target: 'ger',
    originalDescription:
      'Smothered mate by underpromotion! Instead of promoting a queen,\nWhite promotes a knight and gives checkmate in one move as all the possible\nsquares of the black king are blocked by his own pieces. We should never\nforget about underpromotion, sometimes such kind of checks could be decisive,\naltough in most of the cases we should stick to promote a queen as it is the\nmost valuable piece. In this chapter, you will need to deliver such kind of\ncheckmates in different and more complicated situations.',
    translatedDescription:
      'Ersticktes Matt durch Unterverwandlung! Anstatt eine Dame zu nehmen,\nverwandelt Weiß in einen Springer und setzt in einem Zug Schachmatt, da alle möglichen\nFelder des schwarzen Königs durch seine eigenen Figuren blockiert sind. Wir sollten niemals\ndie Unterverwandlung vergessen, manchmal können solche Schachgebote entscheidend sein,\nobwohl wir in den meisten Fällen bei der Umwandlung zur Dame bleiben sollten, da sie die\nwertvollste Figur ist. In diesem Kapitel musst du solche Mattführungen in verschiedenen und komplizierteren Situationen ausführen.',
    hashCode:
      '692d92afc92d55df6d8c96a41a5a3c7b1aa6375337f7634b8655009ed5da885d',
  },
  {
    target: 'ger',
    originalDescription: 'Find a smothered mate',
    translatedDescription: 'Finde ein ersticktes Matt.',
    hashCode:
      '5fdb7acc2e71d9ee94043d32be33e760e4c072d9b238891c0f9cf8ad95d0346d',
  },
  {
    target: 'ger',
    originalDescription:
      'Stalemate is a situation where the player whose turn it is to move is not in\ncheck but has no legal move to continue the game. The rules of chess provide\nthat when stalemate occurs, the game ends as a draw (i.e. having no winner).\nDuring the endgame, stalemate is a resource that can enable the player with\nthe inferior position to draw the game rather than lose. In this position,\nWhite seems to have a lost endgame, however he can save the game with a\nstalemate motif!\n\nWhite either captures the queen or after\n\nWhite is not in check and he has no move, therefore the game is\ndrawn by stalemate!',
    translatedDescription:
      'Patt ist eine Situation, in der der Spieler am Zug nicht im Schach steht, aber keinen legalen Zug zur Fortsetzung der Partie hat. Die Schachregeln sehen vor,\ndass bei Patt die Partie remis endet (d.h. ohne Sieger).\nIm Endspiel ist Patt ein Hilfsmittel, das es dem Spieler mit\nder schlechteren Stellung ermöglichen kann, die Partie remis zu halten, anstatt zu verlieren. In dieser Stellung\nscheint Weiß ein verlorenes Endspiel zu haben, doch er kann die Partie mit einem\nPatt-Motiv retten!\n\nWeiß schlägt entweder die Dame oder nach\n\nsteht Weiß nicht im Schach und hat keinen Zug, daher endet die Partie\nremis durch Patt!',
    hashCode:
      '326359dd13ce553a3ea3774fe1fd331dd6b974b38b9d4a961b93e9a33e96f6cc',
  },
  {
    target: 'ger',
    originalDescription:
      'White seems to be in huge trouble as Qe2 check is going to be decisive,\nhowever here again a stalemate idea saves him:\n\nCompared to the previous position, White has two pawns on board, but it does\nnot change the situation, that White has a legal move. In endgames, we should\nalways pay attention on the stalemate ideas. They are usually very unexpected,\ntherefore it is very easy to miss them both as attacking and defensive side.',
    translatedDescription:
      'Weiß scheint in großen Schwierigkeiten zu sein, da Dd2+ Schach entscheidend sein wird,\naber auch hier rettet ihn eine Patt-Idee:\n\nIm Vergleich zur vorherigen Stellung hat Weiß zwei Bauern auf dem Brett, aber das ändert\nnichts an der Tatsache, dass Weiß einen legalen Zug hat. In Endspielen sollten wir\nstets auf Patt-Ideen achten. Sie sind meist sehr unerwartet,\ndaher ist es sehr leicht, sie sowohl in der angreifenden als auch in der verteidigenden Rolle zu übersehen.',
    hashCode:
      '5468efd37536d400d48113371f74e1ddc1370afd7bfe37d92f5cd70c06339367',
  },
  {
    target: 'ger',
    originalDescription: 'Find a stalemate',
    translatedDescription: 'Finde ein Patt.',
    hashCode:
      '4357ee3f0b80219eb1b285157b3bbb0a9df8a15f34bf2008a1da7a9ad0e0e929',
  },
  {
    target: 'ger',
    originalDescription: 'Give mate in two moves !!',
    translatedDescription: 'Setze in zwei Zügen matt!!',
    hashCode:
      '39f8d094407e4599ab0ed72a83edd607cc1cba60634fd6902a424566512b4341',
  },
  {
    target: 'ger',
    originalDescription: 'Give mate in two moves!!',
    translatedDescription: 'Setze in zwei Zügen matt!!',
    hashCode:
      'a680c6837a2d2860cc118722ad86b0d59cae602bad3cef7c5f29c4390554abbd',
  },
  {
    target: 'ger',
    originalDescription: 'Give mate in two moves!',
    translatedDescription: 'Setze in zwei Zügen matt!',
    hashCode:
      '56d756effc6ca9d18e4a066ef7961fa50fbb61bd7229becf4b9bd3e087a11680',
  },
  {
    target: 'ger',
    originalDescription: 'Find the mate in two moves!',
    translatedDescription: 'Finde das Matt in zwei Zügen!',
    hashCode:
      'dfac2be7fcaa3c8547f7e252e265dc5d018aea68a8bcedd96547bab818d3a21b',
  },
  {
    target: 'ger',
    originalDescription: 'Find mate in two moves!',
    translatedDescription: 'Finde Matt in zwei Zügen!',
    hashCode:
      '31d87d7bcc5afc484d54fa4f8a84d4103a5b8c3cc576721638eb2fe6cfdca7b9',
  },
  {
    target: 'ger',
    originalDescription: 'Give mate in two moves !',
    translatedDescription: 'Setze in zwei Zügen matt!',
    hashCode:
      '95150b1fd3dd246562edb78c25fb622cec1663bba80f1f9dfc0ee957565aeb75',
  },
  {
    target: 'ger',
    originalDescription: 'Give mate in two moves',
    translatedDescription: 'Setze in zwei Zügen matt.',
    hashCode:
      'fa404619c1b01b63c3789b5af3a97c62379dba3184cd64c74199a4e61daee3f4',
  },
  {
    target: 'ger',
    originalDescription: 'Try to find the mate in two moves!',
    translatedDescription: 'Versuche, das Matt in zwei Zügen zu finden!',
    hashCode:
      '51638ae53a3661ac4fc4e90fd5ddb60c27614100b406d5fb0425bd52bbbc60d7',
  },
  {
    target: 'ger',
    originalDescription:
      'Double attack is one of the most important motif in chess. Double attack is\ncalled when we attack two pieces of the opponent in one move!\n\nThe pawn\nmoves forward and attacks both knights, creating a double attack, White wins\nmaterial. This kind of double attack is also called as "fork" as the pawn\ncreates a fork by threatening to take to both directions.',
    translatedDescription:
      'Der Doppelangriff ist eines der wichtigsten Motive im Schach. Von einem Doppelangriff spricht man, wenn wir mit einem Zug zwei Figuren des Gegners angreifen!\n\nDer Bauer\nzieht vorwärts und greift beide Springer an, was einen Doppelangriff darstellt. Weiß gewinnt\nMaterial. Diese Art von Doppelangriff wird auch "Gabel" genannt, da der Bauer\neine Gabel bildet, indem er in beide Richtungen zu schlagen droht.',
    hashCode:
      'b92e6d590358b3ffbce798e083eaf10568cd70bf806dedf99b3889a4abb15534',
  },
  {
    target: 'ger',
    originalDescription:
      'Double attacks can be executed with all the pieces. Sometimes it is even\npossible with the king. For example in this position with plays\n\ndouble attacks the knight and the bishop and one of the pieces gets lost.\n\nIn this chapter, you will need to find a lot of hidden double\nattack to win material.',
    translatedDescription:
      'Doppelangriffe können mit allen Figuren ausgeführt werden. Manchmal ist es sogar\nmit dem König möglich. Zum Beispiel in dieser Stellung:\n\ngreift doppelt den Springer und den Läufer an und eine der Figuren geht verloren.\n\nIn diesem Kapitel musst du viele versteckte Doppelangriffe finden, um Material zu gewinnen.',
    hashCode:
      'e5ecf17d1510e6508cf38ac83a764435254700c64442a1b8c11a6adaa912115d',
  },
  {
    target: 'ger',
    originalDescription: 'Use the double attack idea',
    translatedDescription: 'Nutze die Doppelangriffsidee.',
    hashCode:
      'a7070289176977b72be0906252804985bceaf6aed883a06fc791cb998f628fd1',
  },
  {
    target: 'ger',
    originalDescription:
      'In chess, a skewer is an attack upon two pieces in a line and is similar to a\npin. A skewer is sometimes described as a "reverse pin"; the difference is\nthat in a skewer, the more valuable piece is in front of the piece of lesser\nvalue. The opponent is compelled to move the more valuable piece to avoid its\ncapture, thereby exposing the less valuable piece which can then be captured.\nThe current position is a typical skewer:\n\nWhite gives a check and\nforces the king to go away, leaving the queen falling "for free".',
    translatedDescription:
      'Im Schach ist eine Spießung ein Angriff auf zwei Figuren in einer Linie und ähnelt einer\nFesselung. Eine Spießung wird manchmal als "umgekehrte Fesselung" beschrieben; der Unterschied besteht darin,\ndass bei einer Spießung die wertvollere Figur vor der Figur mit geringerem\nWert steht. Der Gegner ist gezwungen, die wertvollere Figur zu bewegen, um ihre\nEroberung zu vermeiden, wodurch die weniger wertvolle Figur freigelegt wird, die dann geschlagen werden kann.\nDie aktuelle Stellung ist eine typische Spießung:\n\nWeiß gibt Schach und\nzwingt den König wegzuziehen, wodurch die Dame "kostenlos" fällt.',
    hashCode:
      'd2c21909346a8475e5c242b1df804bd8c0f481431728236b538a219fec216078',
  },
  {
    target: 'ger',
    originalDescription:
      "If it was Black's turn, we would reach a theoretical drawn endgame after Kg7.\nHowever the current misplacement of the black king allows White to win the\ngame by using the skewer motif!\n\nWhite intends to promote his pawn\nwhich would mean the end of the game and after\n\nThe skewer!\n\nTry to obtain decisive material advantage in each position by\nusing the help of skewer!",
    translatedDescription:
      'Wäre Schwarz am Zug, würden wir nach Kg7 ein theoretisch remis Endspiel erreichen.\nDoch die aktuelle Fehlstellung des schwarzen Königs erlaubt es Weiß, die\nPartie mit dem Spießungs-Motiv zu gewinnen!\n\nWeiß beabsichtigt, seinen Bauern umzuwandeln,\nwas das Ende der Partie bedeuten würde, und nach\n\ndie Spießung!\n\nVersuche, in jeder Stellung mit Hilfe einer Spießung einen entscheidenden Materialvorteil zu erlangen!',
    hashCode:
      '67668550e91f4e748b0df6e3bf359c0a27e7d3061140f3acf498fb8e5e765dca',
  },
  {
    target: 'ger',
    originalDescription: 'Use the skewer',
    translatedDescription: 'Nutze die Spießung.',
    hashCode:
      'd89aecd754106f0e1e0cc2fff2f7623631d4db59aa9589ff9fab9a5a482ad181',
  },
  {
    target: 'ger',
    originalDescription: 'Use the idea of the pin',
    translatedDescription: 'Nutze die Idee der Fesselung.',
    hashCode:
      '49410db59458a271e201e364e3402b89241071eb42877931563bf65b99096f71',
  },
  {
    target: 'ger',
    originalDescription: 'Try to get decisive material advantage!',
    translatedDescription:
      'Versuche, einen entscheidenden Materialvorteil zu erlangen!',
    hashCode:
      'a2aadf18c53b345c1dfc35ed8890b27a090d93940970d4a8d17bc6420d2f5080',
  },
  {
    target: 'ger',
    originalDescription: 'Try to find the win!',
    translatedDescription: 'Versuche, den Gewinnweg zu finden!',
    hashCode:
      '03abcfae338109425e5577cdeca63e88a8aa92b9083bf367980e3d0a7aeeb155',
  },
  {
    target: 'ger',
    originalDescription: 'Give a mate in three moves',
    translatedDescription: 'Setze in drei Zügen matt.',
    hashCode:
      '73a4fa0b30e1e6003195f3ba50a1047bf330b5713f2a581e22d28f3ed9304e5d',
  },
  {
    target: 'ger',
    originalDescription: 'Give mate in three moves',
    translatedDescription: 'Setze in drei Zügen matt.',
    hashCode:
      'cfea6967b335cad504ef665e0a4a3ceb2f0704137110d34f52b203febac23ea2',
  },
  {
    target: 'ger',
    originalDescription: 'Try to find the mate!',
    translatedDescription: 'Versuche, das Matt zu finden!',
    hashCode:
      'cb8e45559626a25d0ebb2e664b58b95436ab7bd04a263cf52eedfcb51cd6b246',
  },
  {
    target: 'ger',
    originalDescription: 'Try to find the win for White!',
    translatedDescription: 'Versuche, den Gewinnweg für Weiß zu finden!',
    hashCode:
      '4b944bb8b267574db70e037e4e8fbdbaf981dc63767aac0ef82764775456ed52',
  },
  {
    target: 'ger',
    originalDescription: 'Try to find the mate in four moves!',
    translatedDescription: 'Versuche, das Matt in vier Zügen zu finden!',
    hashCode:
      '4b9b53871572da20ef5fbf4e26204dfe919a7da9ba5c40292adeb328157daf9d',
  },
  {
    target: 'ger',
    originalDescription: 'Try to find the mate in three moves!',
    translatedDescription: 'Versuche, das Matt in drei Zügen zu finden!',
    hashCode:
      'dbfe75722e5989a7b992edbae3de88934d9100ba3c3c18e74162504c94cd9358',
  },
  {
    target: 'ger',
    originalDescription: 'Try to find the winning combination!',
    translatedDescription: 'Versuche, die Gewinnkombination zu finden!',
    hashCode:
      '2a69e80717259578609981178699078074aa8535b6e7b082d1e0f0a68776ce42',
  },
  {
    target: 'ger',
    originalDescription: 'Try to find the winning combination for White',
    translatedDescription:
      'Versuche, die Gewinnkombination für Weiß zu finden.',
    hashCode:
      '37478a4dcf74107cc77541856c41532ce7fe389896170077a8b397131ea14a92',
  },
  {
    target: 'ger',
    originalDescription: 'Try to find the winning combination',
    translatedDescription: 'Versuche, die Gewinnkombination zu finden.',
    hashCode:
      '02f6dbc90897285713f7ea31a6e7e7ca9f5c59c121ba1c233f3278c47d093c88',
  },
  {
    target: 'ger',
    originalDescription: '\\/Try to find the winning combination',
    translatedDescription: '\\/Versuche, die Gewinnkombination zu finden.',
    hashCode:
      '73224d4d0d0ce34274ab0c827201662a0e852e6bec902351cc7da2a5d694db07',
  },
  {
    target: 'ger',
    originalDescription: 'White to move and win!',
    translatedDescription: 'Weiß am Zug und gewinnt!',
    hashCode:
      '3b1b374ef5a036a43bd729c58981e64578f4f458fda8f67e21b806ac47fac25f',
  },
  {
    target: 'ger',
    originalDescription: 'Black to move and win!',
    translatedDescription: 'Schwarz am Zug und gewinnt!',
    hashCode:
      '34cc8bd6e9fae0278894b27cf857479ea9c90905eff16e60dde489442def600f',
  },
  {
    target: 'ger',
    originalDescription: 'White to move and make a draw!',
    translatedDescription: 'Weiß am Zug und hält remis!',
    hashCode:
      'c8498e588af94944da2e61eed2f9f62d171e60f3cbfb98a416d35497e0726d94',
  },
  {
    target: 'ger',
    originalDescription: 'Black to move and make a draw!',
    translatedDescription: 'Schwarz am Zug und hält remis!',
    hashCode:
      'fa2d7e245531a1117b4189a9287412d7987c57249af34468a5159b11c29572a0',
  },
  {
    target: 'ger',
    originalDescription: 'Black to move and win',
    translatedDescription: 'Schwarz am Zug und gewinnt.',
    hashCode:
      'bce9fccfb6f2cd7ed0b202bc807ada40f6e652fac9d6aed1270682550349c067',
  },
  {
    target: 'ger',
    originalDescription: 'White to move and win',
    translatedDescription: 'Weiß am Zug und gewinnt.',
    hashCode:
      '46767f4472ed46bd31ca7fc81ebc61fb9ab21fefd9b9b112b8cac9a0afeea639',
  },
  {
    target: 'ger',
    originalDescription: 'Black to move and winBlack to move and win',
    translatedDescription:
      'Schwarz am Zug und gewinntSchwarz am Zug und gewinnt',
    hashCode:
      '9b624abb053eb45232cc95fee7ec416ced4748de6090bc1776493f00a458d244',
  },
  {
    target: 'ger',
    originalDescription: 'White to move and make a draw',
    translatedDescription: 'Weiß am Zug und hält remis.',
    hashCode:
      '1b76bd2df2c8f17180fa1b1f7fe3631bee006f92412b169dc6c25e53199a1acd',
  },
  {
    target: 'ger',
    originalDescription: 'Black to move and make a draw',
    translatedDescription: 'Schwarz am Zug und hält remis.',
    hashCode:
      'fbb890a7b0d9eaae83e5679e40dbe89cd97f6992b7e8b8be3ffffe33bffe90ac',
  },
  {
    target: 'ger',
    originalDescription: 'Try to find the win for White',
    translatedDescription: 'Versuche, den Gewinnweg für Weiß zu finden.',
    hashCode:
      'bd9b1b895e429575b460c37231f86895254daee5498afb0ce58180fc52c6dfcc',
  },
  {
    target: 'ger',
    originalDescription: 'White to move and draw!',
    translatedDescription: 'Weiß am Zug und hält remis!',
    hashCode:
      '01e232190ae29000f9a0f052acb4af1b7bd6f1ba94dc4082d55bb9c23fda90ec',
  },
  {
    target: 'ger',
    originalDescription: 'Try to make a draw with White',
    translatedDescription: 'Versuche, mit Weiß remis zu halten.',
    hashCode:
      '11d661c53f94504c95babe75546502a7d4f63776e13ab45f0150ade1d330b4bc',
  },
  {
    target: 'ger',
    originalDescription: 'Try to make a draw with Black',
    translatedDescription: 'Versuche, mit Schwarz remis zu halten.',
    hashCode:
      'f99138485aaf9f55b6341f57a910b8d29428a7da37ec01f8c88bf75cbb903851',
  },
  {
    target: 'ger',
    originalDescription: 'Try to find the win for Black',
    translatedDescription: 'Versuche, den Gewinnweg für Schwarz zu finden.',
    hashCode:
      'ac759b5f3ee9ffdb0503edb417112cbd64e37a53d9bdc302be4ad02d7af46a19',
  },
  {
    target: 'ger',
    originalDescription: 'White to move and try to make a draw',
    translatedDescription: 'Weiß am Zug und versuche remis zu halten.',
    hashCode:
      'da71fcd1abc764a0689da2db386fbc7470408e0a48d60aa88b61caa7f202338b',
  },
  {
    target: 'ger',
    originalDescription: 'Try to make a draw as White',
    translatedDescription: 'Versuche, mit Weiß remis zu halten.',
    hashCode:
      '0d14ab017c82968cac9720cb5369d025f87c40f1858157930e14bfbc5ab3d843',
  },
  {
    target: 'ger',
    originalDescription: 'Black to move and draw!',
    translatedDescription: 'Schwarz am Zug und halte remis!',
    hashCode:
      '4a8f8341f3f34411635218d0a4cbba7a1ac5d626353959915d2508ba70f0353a',
  },
  {
    target: 'ger',
    originalDescription: '\\/White to move and win!',
    translatedDescription: '\\/Weiß am Zug und gewinnt!',
    hashCode:
      '5b05ba65c960fe0e67e7d40674be171dc056b9d811c0a3e8e5eee2ec420c9e5a',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Rubesamen. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Rubesamen zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '8d7d5326b3c7740b32e5d313a2d28a1032384059e6158a3e0db1e6988fd565ce',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Troitzky. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Troitzky zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '36ec2069ad0b680e7a2950aa0b63622061794eb6f9c483765f6f7f0a5cb83fda',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Rinck. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Rinck zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '56c79aadc28cfe0a030f9df5c49c7656e36f4bf9981deccf5bce15f3bdef1f70',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kolodjakni. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Kolodjakni zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      'c1db35a984bdf27617af19ad9384188e6aa61251dc6dd4c0165fead589a42cdc',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Katsnelson. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Katsnelson zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '04606c639f672cd025786ba8250dbc59fe9453d3d23723b5c7cda2f4c88d27c0',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Evreinov. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Evreinov zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '7c1f4c9f0de2ab403e4e360386cad9ef97280d59a61dd6bd181fb8ad864bbf6c',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Benko. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Benko zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '4ecacabf54ab7b55604d3c6330e57adfc23dff031ac1620d7709cd041ca1bca0',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kurjatnikov. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Kurjatnikov zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      'ce66dbb3b8ab574a8880d2117caeba3ad4e891a18a0ec2e458fd6dc45702501a',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Taniev. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Taniev zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      'ba49138c946a1de13cd338729e38f83233276fb5092e31777840c0069d6bda33',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Pogosjants. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Pogosjants zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      'bfb764e3fb3f0514d6362ed353f3469822b6b81d8d99e82aadb439ad853d3815',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Fritz. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Fritz zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '721fed434c732078e54fceb70ab810fb8116c8a169a32cd845d7296d7121c923',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Rossolimo. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Rossolimo zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '41cc69b9438334cbfbcb686f2bff08ddce1d18443caa0c7150898529712e27c8',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Prokes. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Prokes zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '9d023a9bdad0d854355ff197310fb53cdb52a7c732b9e85d7313ba0ad4d3285a',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Vandiest. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Vandiest zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      'e7f83b232ada2a9f52b936781f0e8d74348727860a7dcec2854ffa3036608ed4',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Sidorov. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Sidorov zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      'b2fa223b3fcaac87478475997ec7b18e8eb83da8e8550b62cc113ca0ec9b45db',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Selesniev. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Selesniev zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '0d1a3c94ad6d2f8700d7660f7c9ffffc30198523b91ddd4b92b64fc4d0dc0c8b',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Hunt. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Hunt zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      'ca62101f26fb501c3ffb2bbc0df21e0bda8f4c5abdb643ff96333011b83290bf',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Pogosjants. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Pogosjants zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '1f04a9d28f9ad7c456cf8bf2974876351c20c1767b4831f1c16f240dccade2d0',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Moravec. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Moravec zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      'bb545ac5bf03c4ba8b2a55188f954833207cfd0c4c7fa56464cebeef4a2d49d6',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Minev. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Minev zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '36959b20aa0e3c547753791101d83e43b7440f7867bf6b6ea55e1ec9ad9d502d',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Bron. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Bron zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      'fbdfe8865fe6ae6e2c8fa8e35493b5dbcd944492886277a7f377340975d3d6cf',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Dawson. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Dawson zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '44207c1be8ac12f689e740f1744557d61566691932108373668735f34d582494',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Zachodjakin. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Zachodjakin zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      'be4380aecf2bcbca02b0573b9fb821219441fba025f187c0cd2030ed858414e0',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kling. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Kling zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      'f71ab8a5e61683dab231be1efe70e181f4d24c04c450954e9a7aecf406e75951',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Gallischek. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Gallischek zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '0aeb0fe88d22ae375f8a52dba8853e7663c60e20d22ea0c006ba12ab3f30a931',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kok. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Kok zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '30046b2df7b9ef680e757d748c556ecce14ac96bd9958ad8c6afa9d35734b72f',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Guljajev. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Guljajev zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '5d6ac016b386722b4f35af7b7a6803254d07f22e8cedcf962b27cff0090df9a8',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Teed. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Teed zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      'f55b327892b47560506c95c5c8965f0bb00b725f7104c41f523a37da0bf51959',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Cvejic. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Cvejic zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '452d288fe62418c69c42a9550b2eb99185b60518309cf8f78e92f3e728c769b8',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of De Feijter. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von De Feijter zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '849935867721af8e25de2c706b20b9ba0f113527920048cf0d2e328e858c92d0',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Carvajal. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Carvajal zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '5416fbc9629a736972ccb4b23da5657da108e39a65d27752f8feea0c1652bb48',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Grigoriev. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Grigoriev zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      'd095f8e1c98b7f8407eb9f614630fb32ff6c60c1a30b0c54379339cb0b48ad8b',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Staudte. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Staudte zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '8c250940a29345f7ffd5fc46ee3daa154e0a92927303862a1678181cddcdbcfa',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Sackmann. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Sackmann zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '9a2409d423e173b515537049dab13bb6ebc50538fa4907f028087c4c6ebbedb6',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Moravec. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Moravec zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '88a4c51eb8251ef50f3ad0633d8f74523357105aaf8dfd6e9055c376d3fcf013',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Isenegger. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Isenegger zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '73212237aa124456aa90f754c2537f789905bce84f421a1295f87d97465e27f1',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kalandadze. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Kalandadze zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      'ae19f522b485abb25272614f53f845ae1e837eaa25d9df56acb598f2f8c84a4b',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Tarrasch. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Tarrasch zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      'be0525293bcfcc6f3d6780d18e23666858a3b976d6a9d36df031add9f8b291b0',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Richter. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Richter zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      'd3721498b19cf705bc3f8c4fe9736d857aa397fca30679f0f10742e1681c5dc5',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Zinchuk. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Zinchuk zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '8e51034ffdd5eb84709681d470c677e940bb89580ec89c2ffa63726042ddb09d',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Shigis. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Shigis zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '320fdfa029cd6dddf3f74ee34e77b45f4ec0fc15a3231a3fd587886521fe58e3',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Keidanz. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Keidanz zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '9d020c62f9343037242e07a4cb8d3da77bf591e2106fe6cae82f0b3b7627dbee',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of De Arriaga. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von De Arriaga zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '07da26cd69fa78c2b5fde8106524ab29d528b921d82aa55df11bd70a42e1686d',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kasparjan. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Kasparjan zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      'a31c436b0e590b79e7bf4e4fc5a07640ab6dff7cb40c11b3d845fdea4a77e672',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Borgstrom. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Borgstrom zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      'bfb66604c7cb3290c3a7679b7cbb68d662ec34cd15a222468cb7d1425e775f31',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Prokes. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Prokes zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '5213622588bf41c15c2192d2485d345bf74a86d8ca971130779a8d5a1f7abc67',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kaiev. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Kaiev zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '2aac4c527d99a2b6a7a20a36ff5229a81c2987c29a414e7ca557018cd1c712cd',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Galberstadt. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Galberstadt zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '4631836f917702b7af7d155ba8f7b1865586712c9fd6ec51b052d30a87df4089',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Petrov. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Petrov zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '3c4e2c84a219e3313208a07fd936cd9596b587f1b062cf2ba417f085b02f7f69',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Platov. White to move and make draw',
    translatedDescription:
      'Versuche, die Studie von Platov zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'a32d1c396dac6bb9fa8b53d7d711a6727761f88fbb1cf1a0685bad4cff1816d4',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Platov. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Platov zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'b42271f0ebcd031bf38fc787c0541f69d0a87cd8fe056597d12a26e7dd384155',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Zevers. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Zevers zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '8ad2d8d6a2ab361efe1a7abca989e6e88ec1dc8f41cc040056239e376d4dd39c',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kubbel. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Kubbel zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '9c394bcd7f57b36bedf7d457f5ca62cc604b773dbe26d8f1ad4d244f6b9374c2',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kubbel. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Kubbel zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'ac709a60fe4a4f08b736a784bd69f649d92168e8abf6152e14f47a9222a7b7be',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Falk. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Falk zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '8614fbcee30c0b8e967e833376a39858e9d71f50a8916dee14927f2516087757',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Hildebrand. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Hildebrand zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'bd3dd797589a82a5bebac26ad1a6fb068ba50c2e8b8f5b4b27674656ac47330e',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Rodriguez. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Rodriguez zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'dbd79d3fa174ec642d8879c04fe7f5b84912ae165d6f4b6be71237146c5f0fc5',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Bondarenko. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Bondarenko zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '8549979cf2d74b766be5983130c9f6d13766187115928f4cae549ff3784844aa',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Fino. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Fino zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'a6ad29104edf367ba931717c0fd7275d34c5721d330a9c194e9c568855dd11ba',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Dedrle. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Dedrle zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '61043a1f163696cb46365328eebc4243c73b4d2d40b5ad234048a201b26bf547',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Selezhnev. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Selezhnev zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'c6a207954307d2ffa95da6c8f95f74ba776c1506d0cec5a48cd7db594873790d',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Halberstadt. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Halberstadt zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'a9f7f71f9979fc582457f0934e1d2d98750a3fb9911a205df83e2460ea6f812b',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Campbell. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Campbell zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'af58adf387d965b62fc46da5f6f5f9053d71e3da61ca1ed52767b7340cac749c',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Amelung. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Amelung zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '2381709185a38cabd517daf67e5d5f14bf4984484943de198f868b771233896e',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Mattison. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Mattison zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '8848bcb728a12954f98267e736a05a9e879dc6c309225ee2f9c44ae8ca09a4a8',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Lazard. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Lazard zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '2abb82cbc07e963fd78def4db66a332d6433b4c59db73e942cf4f52bdce6d459',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Brenew. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Brenew zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '85420459e957dd996b34470db45226368b47e5e4c915f007494a776d1476ace5',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Stamma. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Stamma zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'b76bec409448b8f1839ca471cb883f2b11e2b544720859c15f9ff19b4208715e',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kruchkov. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Kruchkov zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '666fa6c199388e30bc1f313368eb2bd1b78a2531d6fb5cafed917cbbce6f6dbe',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Prokop. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Prokop zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '670c8905a97d5c20bcaba2947cfb269f1418ead58cea252f83814c4f316a3046',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Saavedra. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Saavedra zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '9fdd40e13d6288dc6a20b202db20bd268306eeabaed78a13c44abdfa0fe27d21',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Troitzky. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Troitzky zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '7197e495a523b84bf1cdbe9ab652dc2d91bac3cac2349387ebb237207f942d46',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Levitt. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Levitt zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '18a38a0a2403e3a4333ab3aed25cc9e99030a94fd34c2db6248de16209729550',
  },
  {
    target: 'ger',
    originalDescription:
      'MattisonTry to solve the study of Mattison. White to move and win',
    translatedDescription:
      'Mattison: Versuche, die Studie von Mattison zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '517a5c7835b6a0720f890b503ebded361cc474848364866d3c2c6a66d7b8975c',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Berger. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Berger zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'f22060a4f96becbd9bf7b3631baeb75d48e815dc418d543aeccfa882efd74504',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Holm. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Holm zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'd4acc1ee2ba52d78336a8d30a05e0c096beb8a3aa79036d9beeb5476cd091470',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Vilk. White to move and win\n\nVlk',
    translatedDescription:
      'Versuche, die Studie von Vilk zu lösen. Weiß am Zug und gewinnt.\n\nVlk',
    hashCode:
      '99b7580a6010fe132da9eb3b1cb2edb8f36e3804b76c0d3fa6bc1a792757c829',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Reti. White to move and make a draw\n\nReti',
    translatedDescription:
      'Versuche, die Studie von Reti zu lösen. Weiß am Zug und halte remis.\n\nReti',
    hashCode:
      'a0ad8261f35d118955d0754bfca8bc8fe0b7042d37bb87b4c2224daf55b407e4',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Tattersaal. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Tattersaal zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'adfe92b618e3e56d90f91d234f2edea2c3750b3efeee764ffb23c79d853d614a',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Duras. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Duras zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '9d95019bb3c2e42b9f0ec3b68e1a03af6b11b31307fb28009648fd2a8bf2bb49',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Behting. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Behting zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'd5aaf4612a21ee9d6df8acda7e52bcc0a7be60630957c256d32f38a86b9ff9c7',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kissling. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Kissling zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '35a0151ad1c41780bbae2eb3198268a3b90c4a3c6af9f3ce23f5370c4fb2a9bd',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Heuacker. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Heuacker zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '0e49e8c0ccc0c85664e2ec45c474a9931ba0c09776c45d1c1a83786e1fc2bcdc',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Rinck. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Rinck zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '58c10900c000d9ace57790c6517d2e7d8bb7ebba501906168522f2472f38f4db',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kaminer. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Kaminer zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '8c1c65a6cf12da900d540d6e90782f7e39fba20f3caff47f6c174a298c577051',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Steinitz. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Steinitz zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '78013dbaddebc09c3a97d6a7682aaf7abe8721f87a5ae09759b4716eba6438e1',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Grigoriev. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Grigoriev zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '63c24f4487898d3fdba026775dfded04350464a75447cb1e5f1ccd976ff579fa',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Farago. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Farago zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '6a45f01d24f29427248d9bb82fbb98b99a217473d1e977e0feb03cd1dc63384a',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Selezhnev. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Selezhnev zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '1989f7fead1fc56fb2e383d47549fe532fe5780eb0f446630b9db380a33e5efe',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Grigoriev. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Grigoriev zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'a954fca74722899330c4b3679c016715eb9da7eca02acc5c0b79c0787be3991f',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Aleksandrov. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Aleksandrov zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'ce64f74d4e6d0266ffa382e8e9e66aa45dbb2acf70c951d7214b2ab3de6a1dab',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Gorgiev. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Gorgiev zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'd70a2f149db8e0e108d5998321cae789b7f473c928123bf90b875c7051d33d88',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Prokes. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Prokes zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'db1db2c8854e85d3c1cc3b405a93f9800baa35c3daea149a648bb0b8d362f420',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kasantsiev. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Kasantsiev zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '465ff82b26b5a206099e4fa116aa9306c003ceb06542bc6ffed146f8364e249c',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Bron. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Bron zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '6910f6a2b2f1c7a850d2d7613c4f7c82e452cb62d689f3971cbcaa9f34d2c79d',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Plonnings. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Plonnings zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '43305a81a664db45a35d9152720d40f738d1a174148627e1723088f6b1dd9eb3',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Zachodjakin. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Zachodjakin zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'ac50538952041b1140a5b28f8748a2aa817aa214324b03e3ac149e0b13d9fc2c',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Sehwers. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Sehwers zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '37179329543112de200fcf4bad0bc195b904596d560b28171766d6003321f372',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Troitzky. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Troitzky zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'c72e24b7d9833a0dfbd698fe59c534b3ef5e64305b211d93b1e3a285afe3ffdf',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of De Feijter. White to move and win',
    translatedDescription:
      'Versuche, die Studie von De Feijter zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '6e56f6595983993bf654bc2aa7be38a9e9f845237c9700a281a17956efa6d2f1',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Studenetski. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Studenetski zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '8bdb56c344d11454824a4122a209c753810f0b62f7638901a252deb9f061f05f',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Eisenstadt. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Eisenstadt zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '6334ebab60632b6a3e2032c718b6f1f657b8569cf3760b926ff9e83596d0ad8c',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Neuman. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Neuman zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'd81276f8c93cae791594e31b0b976f6c2ca0c7e6cb0a2e56b9ba8025cd0564d3',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Herbstmann. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Herbstmann zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '009871a38d3bf504e1ec268ef81c878af47883cb983cdee0e4294465e845c38c',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Jakimitsk. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Jakimitsk zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '159ca464b513678e9cb4fd9e55b55c14bc0a913d088f9b3c1573fc296a520033',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Gurvitch. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Gurvitch zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '88312a490947a95e09840b756f0d4b0f15792d6c64aee7dbf468370f205075dd',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Cohn. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Cohn zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '0102ead166ec3e613975f5a77aa06fef35d6c6b5dbe71848181f4160cafcb38f',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Somov. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Somov zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'f11f7da4b62f3687888c4d24677f1d80b00558308228afbe49e18aa292e35ec2',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Bone. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Bone zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '1a624e5e1cbda1f20b1340f75ff20abbea33d3557f31ce2f1e162d525a3dddf6',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Stamma. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Stamma zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'c3047c3feaa077d22d3274edc7eff1c03aa1165414b8b94d201a6b5c96e9a0f8',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Mitrofanov. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Mitrofanov zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'df98d923cfa0085f922c13a8a56788692385519f16ac91475c39ba296d37f297',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Pogosjants. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Pogosjants zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '7cb64a2d7d481ba48824d51204e54e32ee49b0d3d0e71a314525629e62e11aee',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Petlokhi. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Petlokhi zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'e888c95626ceaded9ae4c890d1b62766b4c8e45327154ec9d9b7b09277b7f764',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Afansiev. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Afansiev zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'a587048acfba2819bd5c9ec6b14b74b18890131f61deb320b5ae2b8b0d2d3588',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kovalenko. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Kovalenko zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '8a69d17d2e3bcb1ed3c8decd1d20866a992c47a3ac6cda94fcc38173886e4eee',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Bagdasarian. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Bagdasarian zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'ca5d8956446469a8380b871364d4b2cc9a79d5b78087f88bbb996c99a5a550a2',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Isenegger. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Isenegger zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '7fca7fdc0a0955c4f248c111f6bf1f72a87199ec2292f31f48307992d3e5940f',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kolodjakni. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Kolodjakni zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'd9c391cb872a778d2bafbb1fe6912b31d4fcfb4747ecc5fc8025d06aa63aff1b',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Birnov. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Birnov zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'e9ea7402a48841110fd985ce20be2336e8acd8ad5dc354a2f37354e2088dad39',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Dall Ava. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Dall Ava zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '77b69def6be160e31437dc8a2a050dd7fbc3924d100fd1777b6ed60108fe2113',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Sehwers. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Sehwers zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '489ca8a155d5383337cdc2bb1c322e79649e7ac00a6bc524f58e5322b224696e',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kakovin. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Kakovin zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '9ec2441e33f9045908635092786b4e157d5fdf7562d66b432563a3fa6979ce74',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Makletsov. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Makletsov zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '187afa79fccc5ec20c656e57ba72256429dfe9436201c2706c8351697dddee2e',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kacewicz. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Kacewicz zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'c4bace6c606ec7566bf435a2c27d92ca34159583413343647727f61ef0aa7e22',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Averbakh. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Averbakh zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '9726aa531bb7750895f133460a261db1d05a45a710033e1c87c724fc5cc73052',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Brieger. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Brieger zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'fcf2a998992e3fc5bc9ee8100a0624cbf537df5fb64cb4f0867894618a21e870',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Pogomalov. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Pogomalov zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '60f45740d3c6e0c33e254be21deab4bf6f7d5a8064fb01bb2e9f04f358855591',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Neuenschwander. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Neuenschwander zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'ee41d365b46df1a473ba8c3b1e024f3ea3a3fcb588bd5e1233882bb4cbc7687f',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Supletsov. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Supletsov zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'afb0af06747940b6ff661376b3cf8349041c1a5e6131476214daaf0fc4dfcd6f',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Mees. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Mees zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'a8bc0a9789356bbfa22a24131c5e8679ae7adb6aea5b946b1ab258bc834718da',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Mees. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Mees zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'c660d3a4fbf980571b94d624747c636ba0aaf3a0f8d5078f6ec097e32015d38d',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Grin. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Grin zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '01c19cb071c6b59f58531722ce7173ad2d4df12cf8c6f47f539ad2c2d8ff301a',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Zinar. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Zinar zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '3af2190a3dfd7f616c31a3280f1d46f2c6f65266a22dda8d817d105e8f15e428',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Zinar. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Zinar zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '78c3eb038bfa4b22d7fbccddf6e67e478fa41cb886a6d282aee5c0caf6d5a9ac',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Zalkind. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Zalkind zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '7f88dea774f3c3706e19e6455cd7a9a5470d2d5f4982d6b35dc0bf474ecff281',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Selman. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Selman zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'aa4f41ad68dc0b1a916461a23e4fb437d2f57cf9770bb87a3e38cde2bbf89843',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Buchmann. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Buchmann zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '495f859a34e11dbe26d72f1c1a319cbebbffb446204e62b4f0def7c198cdaacf',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Jakovenko. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Jakovenko zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'eef75017334d1a88de5fbe2d5239b2f1f1a2f625e09f4e55139ea0d19c5be165',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Holm. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Holm zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '64df0e15ccb9a85107dfa7df42b6f4b27e7f893f271b4a699fcad223e206d874',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Krikheli. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Krikheli zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'c365203075d4527e613b3361a7ed68409de5a504ed0c166e4cc5db836129dfba',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Gillberg. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Gillberg zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '2c21d7a22692014aed5f92cc38ab3ccf7edbdf2134d7fa6c603bf3c8722a01bd',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Ivanov. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Ivanov zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '06cf845cbda72d3a65586a0872788d88903e669b560234897a5b06424c842772',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Liburkin. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Liburkin zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '245a95374fa1856d1f75c0d6ddf652b1f81dda133f5e2d10d2c4c65877f4c508',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Ponziani. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Ponziani zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '5b0388e5778cef60bf77df672bba1cab5323d150f0b60790dda34ab7877a5a78',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of De Feijter. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von De Feijter zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '4b3be031b61d36833a90bd58bdfea23417f7510b509e1b52e99e608709f1754b',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Soukup. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Soukup zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '258c83b86a37674ed66d5e66e71f638eaab3ee8584721d4c7852fba8d944c362',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kapfer. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Kapfer zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '531b2033f84325d431c4c8e82a913998c12f195b72680fff9cd00ad780237e64',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Moravec. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Moravec zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '17305dc643702841a7e3130d00f65111390a3ca471de7080f1301d88b9669886',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Iriarte. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Iriarte zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '084b9d2254fa9154d996d5c6a2f84ffcb9899d227cb17c633a71387090c09e11',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Halberstadt. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Halberstadt zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '6fc6d26c5e7f84853ae83c596481f7f639054f762587f3bb8d75e579a11477df',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Sackmann. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Sackmann zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'a8f52621b58b309ee75a813445b037d9e2de072976c98c5f7fb2f8492ab7d568',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Cheron. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Cheron zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'eb2de91dc5c3dee233139e8cbc57dccf1bdce045749893f7eb48e524a420def4',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Horwitz. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Horwitz zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'e0f82a30b1dd334aaf0b99d6d3925220e95abcdcbc551519642afa27babe5550',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Gorgiev. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Gorgiev zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'cf849d682b5fd4bc1a3385e195d43e57d5cca302a0d5f3c10d9df8e116e1167b',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Greco. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Greco zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '4e626a90ed5c71ee766b0207981517b31b4094eb0f03675ab6be2706e5d31595',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Nordlohne. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Nordlohne zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'c0bc7751b98a7535dcae7e37faf4dbeb0f8782a361e9ed75f0eae1911e42acae',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Bron. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Bron zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '57e31a1233909bc16d348763576b88f9da1055ac46916d3a832f80af19938913',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Nadareishvili. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Nadareishvili zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '8cd6e11e9b0921634fe40611308091edde6bb4528e51871d72376303c78207ea',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Tamkov. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Tamkov zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '7bd24bab7d16695c220eb803803831b2c29a6e6c06fa74a54e8b1e5a2d30ed6b',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kivi. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Kivi zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '6d59b675d8ca0e3972cb5d1bee1585f4aed2ad6859288bda8bf7c7ac42c31837',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Blandford. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Blandford zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'acee0a110040708d0db3b9adb396a7564e9a9f4bafbc20708e89247566c1df66',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Lommer. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Lommer zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '3b1f661ae6c342788aaa74200a8f5bbe66e973e6be0bd2bd0ad3bd0e9f733561',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Simoni. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Simoni zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '09b0939a6189509754061b8f5d87af92cc996ffde6623de5efd6779fa246462f',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Lindgren. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Lindgren zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'bf78bde7e3d98161438a2fb554bb38b85c57f510e030a41c0f4d4ef0865a39d6',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Korolkov. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Korolkov zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'cecd1122f4c7fb96d3981912902e331a2d767a5116f50d23e2f222435e141c8f',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Salkind. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Salkind zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '9ab45745cf95ae056b766066f6fb58ff77c486ed1e1f49a64e3c8dd20bd36c18',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Neuschwander. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Neuschwander zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '64bec6abaa522cb7dd394859a23fc26e36deb4928262adda81760c49835f852a',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Amaker. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Amaker zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '5ec0aea13abc4cbbaed7694b4748db609f245503f28bedeb2d97e27523b2ed2a',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Grinfeld. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Grinfeld zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      'ddbe8dad2d11f857cd18b6b8b114878c454e5df362793c33c7f477fac8afdf4b',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Holm. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Holm zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '258b3d4dc4d650b0950868ea6235cdceb9569be623b88f0a620908ebb55a7c4e',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Dehler. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Dehler zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '165e3d22cb912a6934e38799964d5b72fd412a4607fe3e02ff1f8c660feeb8da',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kubbel. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Kubbel zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      'a892b9693e5259b3b60bc9fc31ce95d78315e8253be6fdbc4762ec5f0d12c481',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kuznetsov. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Kuznetsov zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '9c879adac801f7964c6fddbde460413df387beb75fc58eb31c2fb070a0d835b3',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kok. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Kok zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      'd88dfd14ba66ecbd65e14cbf9e9ec9095abb2edcf52706618228428df1db8c09',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kubbel. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Kubbel zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      'f8a66bad80fd8e1db23804c78eea488385181ed7e4b36e77d47b2c4cf5b8df34',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kalandadze. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Kalandadze zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '015670d8c47092cf784ffff1eb165dfa49a21d9185e56f9f80a96270623f3386',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Sochniev. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Sochniev zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '50b4b72d88d8a556359a4de8944a093195277a2d9ff6cd84d4fc49c0ba674d68',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Rombach. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Rombach zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '3267975f1f68193b7523df3e58eb7486c7d357df3d941ba56fcc28e222ddeea9',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kozlov. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Kozlov zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '4f4eb92fbad61c35b19d94890bf410c12a7440247a24b490f89fdb6148763e37',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Sehwers. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Sehwers zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '7899c985bb4b67d0d2033e4af31b12d91eed71594c5d0bf4bc49fe34935ca0e2',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Hoch. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Hoch zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '0e5eca16b5df26a766b20c7de8b223e209eae276214dc7b8d98e91ee93466ada',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Averbach. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Averbach zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      'b844d1b16b82dbceff43dc83e0e81fb123e0775e74a5e0dba0005c6d8d4bd535',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Makletsov. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Makletsov zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      'b65e5f63bc82875ace612ec10e96327eb711eba3e7719c448c8944f586d2f293',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Olmutski. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Olmutski zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '2123104a4593117976f493717c8e16040796f8b0534c14277bce3d4de24db0c5',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kalinin. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Kalinin zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '8a01fcfa7c598428edb7e4f261aa7a6d8ab6f22116f1a33f8f1b2d5a930602f2',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Platov. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Platov zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '0f757a40d93a6f72e66a99e086520b57a588af27e9f1463e2184b4ec3624610f',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Studenetski. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Studenetski zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '584ab7c7d4628c9745051367914dceae5ed348285b0bc36e3b15606a4e6eb79e',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Heuacker. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Heuacker zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '90c9f14c377ce2028ddd50e84cb3c6441024e8948c4c2150de7b5dfe906a18c3',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Fritz. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Fritz zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '854596d047ff576029babb61602d3c83c6001e2cd26667998620f126ebc79d39',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Wotawa. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Wotawa zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '421102642a531f7e7210d3d38fea0643219cb7c2d15a8a81636d2462bfe1d243',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kits. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Kits zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '12cb7a6242bf4f94cefe0fdc62ca6c3c8b52320c9f1364e14cbf9a0727f86405',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kantorovic. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Kantorovic zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '81b5bec556d48a068935d091d52f175eff9812a10fc25ee4f806792059dfde67',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Cook. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Cook zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '8615b643efb9248b834aea0ba1286949a9a17aa86bda062b28cb16c522f2aca6',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Sehwers. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Sehwers zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '2ceafbd34845c099ae491d053ac0e9a33d5cbc38231dfe8b3d57fb3db15be77c',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Koranyi. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Koranyi zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '112f7cf400aea6c97ef899990820d984e1069660040e5d6c83e81e45a3ce586c',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Lapin. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Lapin zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '0f51295a306cf2b9ea462a7a13cb089e629651a5ecf9b340c1d5ddd84f0af17c',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Marwitz. White to move and win!',
    translatedDescription:
      'Versuche, die Studie von Marwitz zu lösen. Weiß am Zug und gewinnt!',
    hashCode:
      '58a2b464ff34cc60b44f4260e1d88eaf504e5633536bd5d7389f4b2659e5dca0',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Isenegger. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Isenegger zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      '19f4a8606795567c07abde332f9324c71dc5bb7f1159731b6bb93be1a32c8784',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Neustadt. White to move and draw!',
    translatedDescription:
      'Versuche, die Studie von Neustadt zu lösen. Weiß am Zug und halte remis!',
    hashCode:
      'cc8637601576ad8227ae2f116b284da0adc471a3534cfd05516b089d082535ba',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Gutman. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Gutman zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'b2a6d78c483e05b13d73e23eb5295577a0787c7be8f0ecd3d12a54cfe2255927',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Keres. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Keres zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '6e9ad07f10e7a7817c8856cdaa6573e20e2e704ed9b26a29728dc08353e54785',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Rinck. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Rinck zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '067db69f82945a7ffd9685d0a4e1066d9d741bdd001946c682cf4038b12499a4',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Mattison. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Mattison zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'c2c8a85f6fa05d9a10350271142cf895a84e2a0b78a62c20673037a5a5acc9ad',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Afansiev. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Afansiev zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '2a134f705cc6240e12bb2041375d234cdb5ef51193dec8dc98ae512f4a56042d',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Beasly. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Beasly zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '7da52f623415d471454055385a2115f07cd59a9973061ea41adc3385e88abec7',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Onate. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Onate zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '208bdc0313b6cfaa01ffa404b09b52bd8c9f537ea4d5afa2d8abfee5df277677',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kozlowski. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Kozlowski zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'af9824e8589b003f2d5e14a2888441c97f443e1e6da2dd647fec40a87788aa22',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Hasek. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Hasek zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '6551db848106c29ce2391b886aa846a976e1100547371f2ca615d8dd634db562',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Platov. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Platov zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'eb8e07f6c277f946e95e3f9dfcd00d3a5faaea3f54d7f0415d74159545e11431',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Daniel. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Daniel zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '45ea83b0d368d84ae62e9a616df733dcf502161f8dd0bb17ca44bdc3e30b944f',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Weenink. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Weenink zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '83f10e4f8e1d36b69dbb1ee910021454d899391b79d3fa2fa5511c103fec3aa8',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Chekhover. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Chekhover zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '3f1a6d8a99a67a9e635926b71086ec495b7c0459440328672ee45c0f9b39c9a9',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Moeller. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Moeller zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'f3b1c7601007b227dc59567654db9a61a7ffcf5ea97f1d400f830d15794a9aab',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Reti. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Reti zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'ec3c299880b87ac5d3f6399ffa9641acde1f4979f5d188b2cc93d92d0eb50ce0',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Bianchetti. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Bianchetti zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '2a04f9d09c4f8d07374327d7df414453c9e5c81307bac473767a0b6680da92ce',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Lazard. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Lazard zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '74da8335c18545d2e0393d125da02322e1edfc0f45844eb1285dfa1ce7a2f0e2',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Hacek. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Hacek zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'df715f8a04e9c77df1cc42336b5e88fc13c550bf71e9cdabbc87c14596ad629c',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Salkind. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Salkind zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '2dd3b05ba35e8159568a461dc6a4acad4bd6f4873292bc8d6183556217f27c58',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Reti. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Reti zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '48cc69ebe2c55e776630ae02d305cda49d8732342d29ad8a171e01b87b96dab9',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Gunst. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Gunst zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'ed486b87266b5c26c12628ffb199635a27bbf4e67d89df005c8586b3b75660cf',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kasparian. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Kasparian zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '3dd14969cdfc51755d561c3f7cba5ed2042b82430ebcb4ed99591f921bc9f739',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Liburkin. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Liburkin zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '48089424c10d4eb1dfd4dbb076f3b94119dbc4e340929efe230d68fd475c647f',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Korterling. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Korterling zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '4574311df75c16ac21ccb13d589c1ac65c1dc38fba41bc0976209429aa2a68ca',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Evreinov. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Evreinov zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '358690e55f6b2f80529829aaca7b1fdae20a9e4b39f486f8033ff1c6746e6c8b',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Godes. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Godes zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '756ec1e7c85b8ab013a2177211ad6900ed70243276a0c0f626a1b6ec1d9f045b',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Selezhniev. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Selezhniev zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '3feef2ea79d24a4221f33c2b503de77a929b518da0981a9513cb2f9dac313483',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Jespersen. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Jespersen zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'f9f56909d9b0ed279ad235ac7c1cdfa87c28149ee30dc94401d2147846686b48',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Isenegger. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Isenegger zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '65b91a98f9ad601e340f2085c738ca77ebc152ab43268b7e7cccd6aa9b6fd216',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Eilazian. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Eilazian zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'd1a2ffebd0c52af3f9c1b2b890ae52ebdab35f5146876428beb89058a1e56191',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Gabovich. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Gabovich zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'f662ee5aa9a15285f2227c0f02e8ed180b4195c5e7d3347bc8e6d5df54eade0f',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Filaretov. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Filaretov zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '3fd2aa8664c2f7331977605258e1b06680de1090b7062011b05112411da3eea1',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Zepler. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Zepler zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '19dd4f46f8dc9c4370c396ce31058bcc21ea5f1ebab130afab690aab612926de',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Seletsky. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Seletsky zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'c9a4efc7b5cf2a85503c8a8ae8ca8b40cf2f63aa0b4da9b8c83306383e969d6b',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Duras. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Duras zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '8ddd0b358b71719a7494225a410031250117abd3bb26ec2e6679c7ecce06a039',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kajev. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Kajev zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '95b98befb21fc052d4a88db8d07d99410ef2118218db4d00a874b4a1d45e4c03',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Gurgenidze. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Gurgenidze zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '1e3481a4edd9b5579a15dced418f50b80806903eaab553b9556bb5262deb6b57',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kovalenko. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Kovalenko zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '3fcae39989b35bf220c1a5d7ceff850218dbea104ef7f00f7d62018d6b336a27',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Roche. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Roche zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'c4a44fc111f00a90302b15575252414b499b4b71f7d64ab471b9af7e41659e88',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Pogosjants. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Pogosjants zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'bafd14b73383d2d19656136953594fec70c473d6c9b356da7f8264398a4f24b9',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Rumiantsev. White to move and make draw',
    translatedDescription:
      'Versuche, die Studie von Rumiantsev zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '3bb71ee6e5f44440938ee35ffa37b1c397261748fa60bcc7e35de5b729d24531',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Gurgenidze. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Gurgenidze zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      'f431be4a9311160574ea4d8b9919b64c27995a0a6b16bfc9f6fd3d7c22b7e7d9',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kralin. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Kralin zu lösen. Weiß am Zug und halte remis.',
    hashCode:
      '1a3160ec08b1f36c2ecde5a6cc24ce758d799d26e8af3365375ed11ddefec0df',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Mozes. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Mozes zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '4bb769707e9fc58931e5d3f29cfc5c15d2a967867bab8f7e5a956958de003b47',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kralin. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Kralin zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'db89ae80ffecfab6dd3dbcd982aab684cec285b1b8005cabd1d34d608e3944ca',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Herbstmann. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Herbstmann zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      'aea5dd1d08a0db9eeefc9f7bd1c026d320100ff2d773108f5df6b4cddc49939b',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Horwitz. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Horwitz zu lösen. Weiß am Zug und gewinnt.',
    hashCode:
      '23bd8c6231eee987636ef335ebd024af80fb64b76798a5c904289a843bdc2df1',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Riester. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Riester zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      'f46c54e094ea2d4ae3b10e585a8330e715b26cb1f1f9d1352cc836fbe6534c39',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Shikril. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Shikril zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      '509a128367936edc3fe007b8c16e4bef326e174ad134617b03b850880bbd966a',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Bent. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Bent zu lösen. Weiß am Zug und hält Remis',
    hashCode:
      '4ee1cfd16ce74c856f617ceed8090cdce14c2ba6aa711374c2c06f399fd73404',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Afek. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Afek zu lösen. Weiß am Zug und hält Remis',
    hashCode:
      '09f5af4e20349342083dd757599bc39b096bac7ca7529cd7db9cd28a3ec25512',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kondratiev. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Kondratiev zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      'bb8cd32829a67fbc0897e8e280318165e046861f9f2b737790425c19327ce97d',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Jarmonov. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Jarmonov zu lösen. Weiß am Zug und hält Remis',
    hashCode:
      '2dad9ae761b186e8377c6267a68cf0a1e45bad3f4aeff42583a007d49dceb20e',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Mann. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Mann zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      '1c43779037f400704be94b23e3a58714117a9ecc6d95300ac1e65799cd5224f5',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Neumann. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Neumann zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      'aa7ac96128307d775b153e994b769a0940db503cc55bdfeee0c6763dee7381cc',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Bouwmeester. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Bouwmeester zu lösen. Weiß am Zug und hält Remis',
    hashCode:
      '4ce0f3703deaa1e9977819dad770236fa5a6a4c27fd73f711c07765fdae30ab7',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Chekhover. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Chekhover zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      '7f722abb1e593342bc7bff8e0abeb9581c01744b2f04cba9a59591dd8f9b4f0b',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Grzeban. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Grzeban zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      '563a9e9ae02827af2f4953cda66706318b37e21ea058205af428b8e0454c9872',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Mandler. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Mandler zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      '8d1144b0ff35192b49b381dc0ccc699ed170330a10be7adeab6ff039cee7dfd4',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Fritz. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Fritz zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      '835609cbe9a55a81303490982a3a00f4b2de4079b98a3210a16b88658aeb8175',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Comay. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Comay zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      '715d3c06ad1e65b3b110ba6cdca873d24e2cd2d23c8e5aa4da6aed89e9d3f89a',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Votava. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Votava zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      'd3cbc35f629fa6f994baffa3713e73e18a7f94ce53f06a5a139f0d4824bd996c',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Kalinin. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Kalinin zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      'c86cf8dba1a14e75610771d1bd4fb6325b57cc3d50f2bf5cc72b89a4cafb2f26',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Razumenko. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Razumenko zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      '716b6d95d738e098aefed761463a9d7bf8748f6bd51c0791afa45e2a4dcc3592',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Chicco. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Chicco zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      'e488dc5faf9c0489a8f9b53deb29b21b702393e86b19a8051bd03f5e3a941fc8',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Jonsson. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Jonsson zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      '60d857b886ebd396ce354021be7b57212bc31c732635fdc4e7961a75c66d50c0',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Richter. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Richter zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      '477afe0949ca46c60bdc80b1953a361ed7351d1f2e6ccc9882562321471a7aac',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Zigman. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Zigman zu lösen. Weiß am Zug und hält Remis',
    hashCode:
      '6ada8aa6f9088689da2967b789186770297a6859fa68a8f20dd3de03af5c6b98',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Sidorov. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Sidorov zu lösen. Weiß am Zug und hält Remis',
    hashCode:
      '9d03fd545b4dbaf667a4acba506f8b3737f891d84b0e2240b99a410575d2111f',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Jensch. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Jensch zu lösen. Weiß am Zug und hält Remis',
    hashCode:
      '45a844c20986d5992b67a126f69e03dab733290d5d428232f5f42560df9bd3c1',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Proskurowski. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Proskurowski zu lösen. Weiß am Zug und hält Remis',
    hashCode:
      'c7ef1907d6b1b810e81f44dcea0b716f26e88104431118b5c0a7679e4c32db8e',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Cheron. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Cheron zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      '5c3158158022109b2f54c0e4e260caeeb08e468566107ff701ebbc2d51ad3bf1',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Salvioli. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Salvioli zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      'b21b580e76d253161447d37b0032f7e388ec0e66bc7d2d72f47dc8eee232c92c',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Timman. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Timman zu lösen. Weiß am Zug und hält Remis',
    hashCode:
      '4e771a30b10db092548078d87e80f6e4e545b1d457d904ca2b13a15236c22df8',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Matous. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Matous zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      'd3438bebe1220aaf2f140914d61325ab0443fb0101996689a428b017a2c486f4',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Benko. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Benko zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      '462bf880eca418264f828bb72fd88284f419d2c8464ca68508d1b786fcb2dbee',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Stolk. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Stolk zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      '4c119045c042eaab72272f2c618e59bd3c6c6166644042e4e4111bea072e579f',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Maklecov. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Maklecov zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      'a06b97c658dea32118c9c9473e2dbc0f608d0a105446ad89fbab944d91477f38',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Sarychev. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Sarychev zu lösen. Weiß am Zug und hält Remis',
    hashCode:
      '78bd2f79310e12db43f044fba70ccb2fa1b28f69e289c9210cf9ef8a4fde6a7d',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Mitrofanov. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Mitrofanov zu lösen. Weiß am Zug und hält Remis',
    hashCode:
      '5706f96565b1fe44f3c2401f4f7ac9aa14666003dcb5e669b4b8335d8c34afef',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Proskurowski. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Proskurowski zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      '3d25322272e917d1c6206365bf23088c708dfd32d76a96852e2e1d20e941b691',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Leepin. White to move and make a draw',
    translatedDescription:
      'Versuche, die Studie von Leepin zu lösen. Weiß am Zug und hält Remis',
    hashCode:
      '13fc01d8af462a3ed88e92072a1c849ba74de7370624a8e37bb5d4776dc34efb',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Mugnos. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Mugnos zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      '0b11096f1c4e703c5967ff5348e843a94f64727e922b863f52151cc2424b30cc',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Perkonoja. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Perkonoja zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      '13ca5c7dc499dc72424ed47cd15bce7d188637a0267ee1a6dde9676c5ec82de8',
  },
  {
    target: 'ger',
    originalDescription:
      'Try to solve the study of Voja. White to move and win',
    translatedDescription:
      'Versuche, die Studie von Voja zu lösen. Weiß am Zug und gewinnt',
    hashCode:
      'b793134ca4267e471843fa4350eb14657eb7100786f85dcc459018837225aca4',
  },
  {
    target: 'ger',
    originalDescription: 'Theoretical position',
    translatedDescription: 'Theoretische Stellung',
    hashCode:
      '8ae1f010cd468dbb9c223027ccf71113f84ee6cad5d9e48929a1c36b8d5f5bbc',
  },
  {
    target: 'ger',
    originalDescription: 'Maizelis',
    translatedDescription: 'Maizelis',
    hashCode:
      'e7a6838eafaed7e1af0fd560e2f299e109fd776c879be94a4676b3574eec7e6b',
  },
  {
    target: 'ger',
    originalDescription: 'Zinar',
    translatedDescription: 'Zinar',
    hashCode:
      'd462e334598e54cfcdfd3258ec9bf86c29cde48ca258e19bea361897b76f3986',
  },
  {
    target: 'ger',
    originalDescription: 'Malakhov, V.',
    translatedDescription: 'Malakhov, V.',
    hashCode:
      'f6570921e5b03fab344b279a0012e2a7f981c09ad50a774faba36615dd91f9f8',
  },
  {
    target: 'ger',
    originalDescription: 'Grigoriev',
    translatedDescription: 'Grigoriev',
    hashCode:
      '6fb3aef3b4a00a8b2e234a165df37895f26dd0498b3f21569293e7bd823c78f3',
  },
  {
    target: 'ger',
    originalDescription: 'Moravec',
    translatedDescription: 'Moravec',
    hashCode:
      'b91718b8df987914c1dc111803fbb55edc83289722e70519e22e68abc3f75f92',
  },
  {
    target: 'ger',
    originalDescription: 'Reti',
    translatedDescription: 'Reti',
    hashCode:
      '26924099ca7b53f80ed054b5a196857d6db652c98f13039cf0c386f5d1eca64e',
  },
  {
    target: 'ger',
    originalDescription: 'Prokes',
    translatedDescription: 'Prokes',
    hashCode:
      'f11205b1614d5b78da64519cec445517a4ee515a6604783019aaa96b67ce4cac',
  },
  {
    target: 'ger',
    originalDescription: 'Ostenstad, P.',
    translatedDescription: 'Ostenstad, P.',
    hashCode:
      'ecc8e97eb83182a734efdc5cb59d0316b82f3a5dae1972c850f629035503f6a7',
  },
  {
    target: 'ger',
    originalDescription: 'Khaetsky, Roman',
    translatedDescription: 'Khaetsky, Roman',
    hashCode:
      '3aa9963f50dfe7eaa9ac59466dec236494fc96d379593233f69a0b5224ebcf8e',
  },
  {
    target: 'ger',
    originalDescription: 'Santos, P.',
    translatedDescription: 'Santos, P.',
    hashCode:
      '9116e4ec98cf82d5e4a0eb8953a2a08820c90241e34c77c8d26186e3fe5342f7',
  },
  {
    target: 'ger',
    originalDescription: 'Skuja, R.',
    translatedDescription: 'Skuja, R.',
    hashCode:
      'addd0048aa794a1693f9944c09195946a6a188d2a94a2ab31014a4dbc9edef48',
  },
  {
    target: 'ger',
    originalDescription: 'Practical position',
    translatedDescription: 'Practical position',
    hashCode:
      '38ecb5893862a3d9a8081f89f84079dc50f26a24fef6b34aa48a3da2eb435fb9',
  },
  {
    target: 'ger',
    originalDescription: 'Kortschnoj, V.',
    translatedDescription: 'Kortschnoj, V.',
    hashCode:
      'f984241f67140f4ab14dab4774557f5873f9cbd895a219785312dbc3649e63bc',
  },
  {
    target: 'ger',
    originalDescription: 'Botvinnik, M.',
    translatedDescription: 'Botvinnik, M.',
    hashCode:
      '745ce41784ee6178aef420bf93e2072797c3db0b3a853f7789424f7424da9a05',
  },
  {
    target: 'ger',
    originalDescription: 'Proskurowski',
    translatedDescription: 'Proskurowski',
    hashCode:
      'f40627b10f98363f25482c0465ffd13a59e19c4c1a1f9751254fa3b5d0c70b93',
  },
  {
    target: 'ger',
    originalDescription: 'Botvinnik',
    translatedDescription: 'Botvinnik',
    hashCode:
      '64b6aa65ce808e1d3db24fbc54df4d036647d61c41925cba376b0dfd79e06570',
  },
  {
    target: 'ger',
    originalDescription: 'Ivkov',
    translatedDescription: 'Ivkov',
    hashCode:
      'a64b7a95e2d4924be348c77456a7924d3e85357251f36cc8518a5119f1a273a1',
  },
  {
    target: 'ger',
    originalDescription: 'Camacho, A.',
    translatedDescription: 'Camacho, A.',
    hashCode:
      '676b9a4ca1ccc520fefa872cfd5d21058de4565c666dfdd2a0bbd2672a98bd1b',
  },
  {
    target: 'ger',
    originalDescription: 'Mamedyarov, S.',
    translatedDescription: 'Mamedyarov, S.',
    hashCode:
      '68e1de6198fead171ed073c32422ef012f2ff029fc47710928facae0c0608ab9',
  },
  {
    target: 'ger',
    originalDescription: 'Baramidze, D.',
    translatedDescription: 'Baramidze, D.',
    hashCode:
      'c601fe9ed59d9973e6400dff99584cc5dd9b43457b22568729d3a0bb7a1492db',
  },
  {
    target: 'ger',
    originalDescription: 'Shanava, K.',
    translatedDescription: 'Shanava, K.',
    hashCode:
      '29616ba4aa0a381e17b73679de9c9a7a8007ee62aa76f71737b9bdbddcd1599b',
  },
  {
    target: 'ger',
    originalDescription: 'Seirawan',
    translatedDescription: 'Seirawan',
    hashCode:
      'bf39f1fee99b1ecba1786dea3bf643b707b3c6fe946f5f734b84118d5669d54a',
  },
  {
    target: 'ger',
    originalDescription: 'Sarno, S.',
    translatedDescription: 'Sarno, S.',
    hashCode:
      'b21e6e543252e791a92b277b20493d23ce410fc4c104788fcce83ba5bc391c67',
  },
  {
    target: 'ger',
    originalDescription: 'No description available',
    translatedDescription: 'No description available',
    hashCode:
      '77d82c38aa8c51f29c8a8ccb99083ec269ccf22b11668c5e09692dcacd2962d4',
  },
  {
    target: 'ger',
    originalDescription: 'Prokop',
    translatedDescription: 'Prokop',
    hashCode:
      '529f7bddee32be873db75168d1dff35ecdac6f67636c3ab0a4738c07c2f42903',
  },
  {
    target: 'ger',
    originalDescription: 'Grigoryev',
    translatedDescription: 'Grigoryev',
    hashCode:
      'bf5523b33afb8b4e55a87ad6fa991cb7d269574d7ddb47714efa0139ea42f514',
  },
  {
    target: 'ger',
    originalDescription: 'Marvitz',
    translatedDescription: 'Marvitz',
    hashCode:
      'c2b33694e6929944f5c83733a1ec6296de4b0c3b3c5b912476243fb958ca6f61',
  },
  {
    target: 'ger',
    originalDescription: 'Rink',
    translatedDescription: 'Rink',
    hashCode:
      '97566246967cc014d78d0f7a5b4d442b6aff055c5cd60c941f9432933d493118',
  },
  {
    target: 'ger',
    originalDescription: 'Prokesh',
    translatedDescription: 'Prokesh',
    hashCode:
      'b4f401bd69e359fd44a86f4c8073bbbc7583dd820c0fb96ea000c84ee06d992d',
  },
  {
    target: 'ger',
    originalDescription: 'Isenegger',
    translatedDescription: 'Isenegger',
    hashCode:
      '8f6721e0f680eb266e945d78ec7f170c3960ebc9f1e18a6539511271638a71d2',
  },
  {
    target: 'ger',
    originalDescription: 'Taku',
    translatedDescription: 'Taku',
    hashCode:
      'c0b269923ced5017bd2e1612d798ea7669fbc2a8b705e720e7107c7386f5a649',
  },
  {
    target: 'ger',
    originalDescription: 'Dore',
    translatedDescription: 'Dore',
    hashCode:
      'd0b8c94be5531afdb547058362c16ff256bdce70b311402c741916336f340757',
  },
  {
    target: 'ger',
    originalDescription: 'Ban',
    translatedDescription: 'Ban',
    hashCode:
      'b2a96c3d3fc2b6accdb4816e22467a7448defe3208a72a79a96d671e4087106e',
  },
  {
    target: 'ger',
    originalDescription: 'Klinkov',
    translatedDescription: 'Klinkov',
    hashCode:
      'c41b57cdc379880a4722bec27fd68b5dd95808beeb6093af6e10f0ca5fa7412b',
  },
  {
    target: 'ger',
    originalDescription: 'Holzhausen',
    translatedDescription: 'Holzhausen',
    hashCode:
      '5f31cf2ad4206a35b6d5211fc0fd854e3b9fa2f3a24be47a168210e5dca1166c',
  },
  {
    target: 'ger',
    originalDescription: 'Gunst',
    translatedDescription: 'Gunst',
    hashCode:
      'bf70c27fa1179296f89361daa82c8a9bbf388cd22f639bbca9c14fbbdea584f4',
  },
  {
    target: 'ger',
    originalDescription: 'Lapin',
    translatedDescription: 'Lapin',
    hashCode:
      '7b2f2147a674007b92cb0d6856ee0b4660c2b9863e0843df24928187f43eb062',
  },
  {
    target: 'ger',
    originalDescription: 'Zepler',
    translatedDescription: 'Zepler',
    hashCode:
      'c3aee166eb136cecac6a7f615680691ce78ab33b8b26f8ec2da810018be92af2',
  },
  {
    target: 'ger',
    originalDescription: 'Munios',
    translatedDescription: 'Munios',
    hashCode:
      'f9a8752f19ed94763f6eac322032f9b652c5f376f254659fe8c2c216b8c03b97',
  },
  {
    target: 'ger',
    originalDescription: 'Iriarte',
    translatedDescription: 'Iriarte',
    hashCode:
      'ef4e4a2037b39bae7070b4d396cacb44e9bfa3d9a401c6b1fb9e8911efd7bcb5',
  },
  {
    target: 'ger',
    originalDescription: 'Herberg',
    translatedDescription: 'Herberg',
    hashCode:
      '454ebf0c95d830db3559fad74daf912f9d845dd3decab4494c735e11420e49d6',
  },
  {
    target: 'ger',
    originalDescription: 'Kubbel',
    translatedDescription: 'Kubbel',
    hashCode:
      'be9338af23044779479b9afe33fc1a8356db4489d2e4c02b4e2bcd97ca15f4ea',
  },
  {
    target: 'ger',
    originalDescription: 'Georgala',
    translatedDescription: 'Georgala',
    hashCode:
      '1dbec73e49cbde2df7610a5994be1282b8b8226442a9c17653cc961bec7f20db',
  },
  {
    target: 'ger',
    originalDescription: 'Khegqvist',
    translatedDescription: 'Khegqvist',
    hashCode:
      'be077a39fa3f50638d08211cef91a52b9e6722268c4481a843f63aa506f71226',
  },
  {
    target: 'ger',
    originalDescription: 'Schtekbauer',
    translatedDescription: 'Schtekbauer',
    hashCode:
      '8e20a9f0140abbdbf476387da8a85431a02e7c263b37a123acb7e95c6ac88051',
  },
  {
    target: 'ger',
    originalDescription: 'Iakimchik',
    translatedDescription: 'Iakimchik',
    hashCode:
      '10ed9b5b466c420e454ddce1a79fc4435a9b86470275f5d973f019256e6275fe',
  },
  {
    target: 'ger',
    originalDescription: 'Bondarenko',
    translatedDescription: 'Bondarenko',
    hashCode:
      '046398f5a00dd3b1aaa364dbed3898c626ea9bc12a239a0d5c21435f83c654b1',
  },
  {
    target: 'ger',
    originalDescription: 'Laznichka',
    translatedDescription: 'Laznichka',
    hashCode:
      'e766aae2e650f9286d2fd3d5329717f021736381ec09a93122f76e8f56fb33a2',
  },
  {
    target: 'ger',
    originalDescription: 'Skalichka&Schubert',
    translatedDescription: 'Skalichka&Schubert',
    hashCode:
      '343b61bf02286937a1ada2eea3513390c4ea55302ef051b98fbf2c94e5f37c18',
  },
  {
    target: 'ger',
    originalDescription: 'Kok',
    translatedDescription: 'Kok',
    hashCode:
      'd6ba8bf227ba2c637c444a9f59764f28da0e06c868770f1be41278c536efb6b3',
  },
  {
    target: 'ger',
    originalDescription: 'Farago',
    translatedDescription: 'Farago',
    hashCode:
      'f41476e6b1ac47bd39e18ae7a405d57c8f81d2ee6bb689d3d4ab33377d296af2',
  },
  {
    target: 'ger',
    originalDescription: 'Niezl',
    translatedDescription: 'Niezl',
    hashCode:
      '0749233d4d2a1164efe6ce6b6ee82bfed9d99687282c311d9a2fe4bac2c1ec32',
  },
  {
    target: 'ger',
    originalDescription: 'Novikov',
    translatedDescription: 'Novikov',
    hashCode:
      'dfae8844dfcb4971414d8560de03cfa8b8f4df9b7c9145fa300eb4ad6ae94c59',
  },
  {
    target: 'ger',
    originalDescription: 'Korolkov&Mitrofanov',
    translatedDescription: 'Korolkov&Mitrofanov',
    hashCode:
      'f58bba06cdbc10614c722bc559a109b6d281a228ac1bca049901930bbc872b8b',
  },
  {
    target: 'ger',
    originalDescription: 'Mitrofanov',
    translatedDescription: 'Mitrofanov',
    hashCode:
      '5aa50f6e4ab1ac1760e4eda8afb2c9c4a5f69af8bb927fd74ac4c6f6cb8aecb0',
  },
  {
    target: 'ger',
    originalDescription: 'Sheron',
    translatedDescription: 'Sheron',
    hashCode:
      'c146a8802c53d6ba6aefa3f13dd5e90445343f63fe4c299334d42617c705220d',
  },
  {
    target: 'ger',
    originalDescription: 'Teodoru',
    translatedDescription: 'Teodoru',
    hashCode:
      'bdd1f00b6621ccde2f286d6f0ae3e12d54eb54be9e7bf8b91c53791db3f92a91',
  },
  {
    target: 'ger',
    originalDescription: 'Ellison',
    translatedDescription: 'Ellison',
    hashCode:
      '7c366b6727c76f70b8c062db208e763183e040ba0f661106c1f36b08f8771708',
  },
  {
    target: 'ger',
    originalDescription: 'Voja&Nestorescu',
    translatedDescription: 'Voja&Nestorescu',
    hashCode:
      '47863470dbc7f8516fb106b79d6c4f2c2c47d022200cf5db388bf2a2d71f8076',
  },
  {
    target: 'ger',
    originalDescription: 'Galberstadt',
    translatedDescription: 'Galberstadt',
    hashCode:
      'b0c489661962aeb5833422813a56919fa6645760ef2ae6fe50c7b4dad2e75233',
  },
  {
    target: 'ger',
    originalDescription: 'Olmutzsky',
    translatedDescription: 'Olmutzsky',
    hashCode:
      '15fc857ce197907d2977fe4343a2497605d2b138ea1558c5106ef2cd5ee1192b',
  },
  {
    target: 'ger',
    originalDescription: 'Fritz',
    translatedDescription: 'Fritz',
    hashCode:
      'c40727c66d04b725818d4579040bcc69d5cfd9b430889a1af92f02e2cdb1bde2',
  },
  {
    target: 'ger',
    originalDescription: 'V&M Platov',
    translatedDescription: 'V&M Platov',
    hashCode:
      'e4d740a18d1cc272d3d61eabd80640ec96dfa1d70b6f7068a97af5397eaa0a65',
  },
  {
    target: 'ger',
    originalDescription: 'Venink',
    translatedDescription: 'Venink',
    hashCode:
      'd86d8a627478fcbdcf5b51622e033b80c94a67c6421b041b71935cacf04eaeb8',
  },
  {
    target: 'ger',
    originalDescription: 'Troitsky',
    translatedDescription: 'Troitsky',
    hashCode:
      'd7663660ac844939fa857158727f821a28e38549f022131d941761207856865a',
  },
  {
    target: 'ger',
    originalDescription: 'Levit',
    translatedDescription: 'Levit',
    hashCode:
      '65764b195ecd9dc8076589a0a1b3d64ee3e5ae9345ece13f3a50be9e818cf3ab',
  },
  {
    target: 'ger',
    originalDescription: 'Sackmann',
    translatedDescription: 'Sackmann',
    hashCode:
      '800684ad40e63f2f8bcffb35fc8984d1aa5d9a80d2d13677063628b371fe664a',
  },
  {
    target: 'ger',
    originalDescription: 'Kaminer',
    translatedDescription: 'Kaminer',
    hashCode:
      'cecdf52d249e7615fd628bd559632ee7a1b061b857272a2db9138ff7888d92e5',
  },
  {
    target: 'ger',
    originalDescription: 'Platov',
    translatedDescription: 'Platov',
    hashCode:
      'f314e95006215052c6de7ac23deda1e9e59aa821a3beb4c1a5befbd7d1f4a8e4',
  },
  {
    target: 'ger',
    originalDescription: 'Tapionlina',
    translatedDescription: 'Tapionlina',
    hashCode:
      'd30308f10305851278851859aa38dc4b8d9d5f138d901562fcaf0033006b43ca',
  },
  {
    target: 'ger',
    originalDescription: 'Khashek',
    translatedDescription: 'Khashek',
    hashCode:
      '371cc3ff54c929e81c96a84f2e507d4b17a335ee603e740d8cdd39e7c8d245b3',
  },
  {
    target: 'ger',
    originalDescription: 'Khavel',
    translatedDescription: 'Khavel',
    hashCode:
      'de0c88a39decafa4d92363a24974e3cec937de75028cb9ab324ba27733bd0dde',
  },
  {
    target: 'ger',
    originalDescription: 'Kheks',
    translatedDescription: 'Kheks',
    hashCode:
      '2b44a9857a2d58f56b4a1624739d100433376236663f8c212dc473c5100e3497',
  },
  {
    target: 'ger',
    originalDescription: 'Lazar',
    translatedDescription: 'Lazar',
    hashCode:
      'f02e35f1a7c491ec7073466d631e23b1d439d276f32367c360976aa5c598d6c2',
  },
  {
    target: 'ger',
    originalDescription: 'Riikhimaa',
    translatedDescription: 'Riikhimaa',
    hashCode:
      '1b8cefc4f9f51bece68ca891eab7fa2de1ec89aec27448aa5c4e06bb83a26316',
  },
  {
    target: 'ger',
    originalDescription: 'Paoli',
    translatedDescription: 'Paoli',
    hashCode:
      '4d25c47c785f70055b713b0f9205cd6a0437bbc8b2d33844ac8553a47049c4a4',
  },
  {
    target: 'ger',
    originalDescription: 'Richter',
    translatedDescription: 'Richter',
    hashCode:
      '95f8a74bf066fa7336034caae6ce5dd8afa2926b572db00019844fc041f24859',
  },
  {
    target: 'ger',
    originalDescription: 'Gurgenidze',
    translatedDescription: 'Gurgenidze',
    hashCode:
      'e61dd85e3e883d25833e0aee181ee9449098cd960b44044b751d94d5ca654eb4',
  },
  {
    target: 'ger',
    originalDescription: 'Kakovin',
    translatedDescription: 'Kakovin',
    hashCode:
      'e984ea288e5b2393512ef89f7c85b7bbf1cb9ef6364e8408b0569b83ad00bc08',
  },
  {
    target: 'ger',
    originalDescription: 'Korolkov',
    translatedDescription: 'Korolkov',
    hashCode:
      '03b62aa2848da9a5d088cba33dfc961f3610b05819d8bf987dec9ff8912db2d8',
  },
  {
    target: 'ger',
    originalDescription: 'Libursky',
    translatedDescription: 'Libursky',
    hashCode:
      '9f511476be8e198d5763267f9773498b377337ecd84ba853d84ef95a29459bd6',
  },
  {
    target: 'ger',
    originalDescription: 'Koshchakov',
    translatedDescription: 'Koshchakov',
    hashCode:
      '76ee7e17a3944de8fe8c4d3b135682c13813f2371c68b40e017fa0a59f9e3d48',
  },
  {
    target: 'ger',
    originalDescription: 'Moravetz',
    translatedDescription: 'Moravetz',
    hashCode:
      '24b33d86b8e29fe2a7369e6197e4b3e30806a4c09de4c3eb19145eac977029b9',
  },
  {
    target: 'ger',
    originalDescription: 'Erikson',
    translatedDescription: 'Erikson',
    hashCode:
      '2ef59379a6e41367bcd2b99613708d35bf06dc125545050a7344b16de4339cd4',
  },
  {
    target: 'ger',
    originalDescription: 'Kaila',
    translatedDescription: 'Kaila',
    hashCode:
      '60d772fd9b5afa8ab03b4090c42aa7297d854e7dc35a250adf1249981d222e58',
  },
  {
    target: 'ger',
    originalDescription: 'Otten',
    translatedDescription: 'Otten',
    hashCode:
      '37531bb6ee8507c50eec0daa57eedccd67fc29ac1bd7d8de92848cfb99a855f2',
  },
  {
    target: 'ger',
    originalDescription: 'Kholm',
    translatedDescription: 'Kholm',
    hashCode:
      '2bcc256e0b3411dc191df953ebf35d15c74ef141789c3012433b8e6336d32ca8',
  },
  {
    target: 'ger',
    originalDescription: 'Feyter',
    translatedDescription: 'Feyter',
    hashCode:
      '953d1b0ea6e609747b93b107eb3186baa64eb6f840981ea4e382d431182af01a',
  },
  {
    target: 'ger',
    originalDescription: 'Konikovsky',
    translatedDescription: 'Konikovsky',
    hashCode:
      'b8bea4a3c05df51e12dc79454b607c36f49eaf61b72e4433736e073ae87de16c',
  },
  {
    target: 'ger',
    originalDescription: 'Votava',
    translatedDescription: 'Votava',
    hashCode:
      '1b67e34550f118685778239fb996e8c696b885bbd6b7b6502eaaf98e4fcfa777',
  },
  {
    target: 'ger',
    originalDescription: 'Dall Ava',
    translatedDescription: 'Dall Ava',
    hashCode:
      '2c7a4b18eb422cc1ddfaa4ffd9d2a086084df757fb978fbf0f33a896ac354df1',
  },
  {
    target: 'ger',
    originalDescription: 'Liburkin',
    translatedDescription: 'Liburkin',
    hashCode:
      'a94801e1325d7162615b61252394973a609f070dfff5104aa658728d183695a7',
  },
  {
    target: 'ger',
    originalDescription: 'Mandler',
    translatedDescription: 'Mandler',
    hashCode:
      '16427945e3b12075e95ee27ad8f7ef458bf38cab72170ea923068f3aa6f32d37',
  },
  {
    target: 'ger',
    originalDescription: 'Koschakov',
    translatedDescription: 'Koschakov',
    hashCode:
      '73c572e91915677719ab6a62379abb5dac93e344d5b31437b58c60037f92bf7c',
  },
  {
    target: 'ger',
    originalDescription: 'Razumenko',
    translatedDescription: 'Razumenko',
    hashCode:
      'fdb27b65afb5c2249179b907d9172ff481d6dfa5dcade348a42fb434f1e343b8',
  },
  {
    target: 'ger',
    originalDescription: 'Kaiev',
    translatedDescription: 'Kaiev',
    hashCode:
      '1a9aa4a9b961d7d57def7c8aab0c4801b029946717f94007ee6b096742629376',
  },
  {
    target: 'ger',
    originalDescription: 'Weinberger',
    translatedDescription: 'Weinberger',
    hashCode:
      'fb9c905fc41632310ecce7829ee07a8029ff80b45fbb8227fba9cece4e0d34f5',
  },
  {
    target: 'ger',
    originalDescription: 'Herbstmann',
    translatedDescription: 'Herbstmann',
    hashCode:
      'a034810afdf4eb31b73e45442c6353e364fc6b9f91914be1d4edea188031df13',
  },
  {
    target: 'ger',
    originalDescription: 'Vam Breukelen',
    translatedDescription: 'Vam Breukelen',
    hashCode:
      '0939d8a2bf510bae5a597802874227a6585877bba83da8195a7679d3cbe49813',
  },
  {
    target: 'ger',
    originalDescription: 'Averbakh',
    translatedDescription: 'Averbakh',
    hashCode:
      '52f5ffd4c3d4f2637e2d0a37f1880bf076901835f00a4018b7c6fc1ff609b438',
  },
  {
    target: 'ger',
    originalDescription: 'Efron',
    translatedDescription: 'Efron',
    hashCode:
      '4b389312dec81628921ce1fb7b79862aa26dc59e829c9e1b5aff6063d00772d7',
  },
  {
    target: 'ger',
    originalDescription: 'Horvitz',
    translatedDescription: 'Horvitz',
    hashCode:
      '938a6c0a53e766e7d530b026c08d22518c3a9d1d2f5c2fb182d838e7477ecd40',
  },
  {
    target: 'ger',
    originalDescription: 'Duras',
    translatedDescription: 'Duras',
    hashCode:
      'cc87b8e5b75f79b870cc58887665bcf2f44e97fce14a9eb6fe704b6de86b6f4a',
  },
  {
    target: 'ger',
    originalDescription: 'Trinks',
    translatedDescription: 'Trinks',
    hashCode:
      '9b8970a6c9d48572e41a1ee18947f0211f071832af50f5bd93bb851779336162',
  },
  {
    target: 'ger',
    originalDescription: 'Makhatadze',
    translatedDescription: 'Makhatadze',
    hashCode:
      '74bd899f8d6b14a0c8fb7bdd6dae5590c32467e7f57339a97a6bc1363758847e',
  },
  {
    target: 'ger',
    originalDescription: 'Eriksson',
    translatedDescription: 'Eriksson',
    hashCode:
      '2af17d7dd151a595d73d11668b48f66817a0f004132a821db8d96d75f372ef55',
  },
  {
    target: 'ger',
    originalDescription: 'Megvinishvili',
    translatedDescription: 'Megvinishvili',
    hashCode:
      '4bc1ac5b86e112c1beda57ab469692f93103348523ea45dd505f00ead75dc330',
  },
  {
    target: 'ger',
    originalDescription: 'Bondarenko&Kakovin',
    translatedDescription: 'Bondarenko&Kakovin',
    hashCode:
      '7dd543752e18529e470aea42686c26362074065dd91d37915479993596ee9cf3',
  },
  {
    target: 'ger',
    originalDescription: 'Stolk',
    translatedDescription: 'Stolk',
    hashCode:
      '303111a7b22727be793a108c76a119957c8b8ef7fab7ab2e228ae586a251416f',
  },
  {
    target: 'ger',
    originalDescription: 'Rudenko',
    translatedDescription: 'Rudenko',
    hashCode:
      '36821a6f55f8238368d8e44d7d4e698ec73251b35d1fd5e0bec3d4d5cf104200',
  },
  {
    target: 'ger',
    originalDescription: 'Kolesov',
    translatedDescription: 'Kolesov',
    hashCode:
      '39688041d275d61406ca031c7d85eac40aa7c16e9da15ad49053dd5de9f5de5e',
  },
  {
    target: 'ger',
    originalDescription: 'Evreinov',
    translatedDescription: 'Evreinov',
    hashCode:
      '33b6291019f533eacb83066e9138b68938783b293ad5b4f55a93bdb12f3f3e87',
  },
  {
    target: 'ger',
    originalDescription: 'Vennik',
    translatedDescription: 'Vennik',
    hashCode:
      '5cfc5724b9b52c275fb1b2afb9be1e8e4d3a657f0a9bb5729724ba13c3d2cace',
  },
  {
    target: 'ger',
    originalDescription: 'Kheiecker',
    translatedDescription: 'Kheiecker',
    hashCode:
      '8b9c3e04749197c3da0bd9a0a172982d7bb56f3ecc255f8071980183198838b4',
  },
  {
    target: 'ger',
    originalDescription: 'Vandekastele',
    translatedDescription: 'Vandekastele',
    hashCode:
      'eca2e7e3d3811ff974c80bfac6c4c07f90b4f42b322af0f8857430c321d83547',
  },
  {
    target: 'ger',
    originalDescription: 'Schulz',
    translatedDescription: 'Schulz',
    hashCode:
      '385590bfc3f81a78bf3a7588e53bb162ff4a0cbf6c7f3267f83c675596da9a46',
  },
  {
    target: 'ger',
    originalDescription: 'Biuzandian',
    translatedDescription: 'Biuzandian',
    hashCode:
      'e9f36ac745584e60e5a24a87cbf3117410549a8c93927d7df6362c95967a570c',
  },
  {
    target: 'ger',
    originalDescription: 'Godes',
    translatedDescription: 'Godes',
    hashCode:
      'e19c2453b2de51571f43add9b2110023ac5dc783b98ad70892a1af5b7bbb7d45',
  },
  {
    target: 'ger',
    originalDescription: 'Isler',
    translatedDescription: 'Isler',
    hashCode:
      '1545584471f54dcd971ef03c40f496e96d92af59fbcc7631b6c6711a93ae8b73',
  },
  {
    target: 'ger',
    originalDescription: 'Steckbauer',
    translatedDescription: 'Steckbauer',
    hashCode:
      '2549763b6fdd553e53f0f25698585d99ebd09a890a21fcd7115118c1394d8f7b',
  },
  {
    target: 'ger',
    originalDescription: 'Norlin',
    translatedDescription: 'Norlin',
    hashCode:
      '64adb66a527d4cf91df38c95d84c87fae5ece47d53dc3a65ee861955f525fe0d',
  },
  {
    target: 'ger',
    originalDescription: 'Kasparian',
    translatedDescription: 'Kasparian',
    hashCode:
      '9a493ec8c503c23f64b7c304e9b40018900cba8b3812d2a4bdfce7e877e6eb4a',
  },
  {
    target: 'ger',
    originalDescription: 'Dedrle',
    translatedDescription: 'Dedrle',
    hashCode:
      '00b660857044241832c63e7774e696c726cd799ccaf145ed6477cc05582cdce3',
  },
  {
    target: 'ger',
    originalDescription: 'Tollenaar',
    translatedDescription: 'Tollenaar',
    hashCode:
      'e8c0b54b3062abe2eabd003d48da58eb3debde1e918229544fff8c15b3e3b38e',
  },
  {
    target: 'ger',
    originalDescription: 'Infantozi',
    translatedDescription: 'Infantozi',
    hashCode:
      '05600a4776123b6e7c4d920ae0259efa6a974c24badc254d481ddfbfe954abd4',
  },
  {
    target: 'ger',
    originalDescription: 'Vatarescu&Ianosh',
    translatedDescription: 'Vatarescu&Ianosh',
    hashCode:
      'bdb401d51eaa6f388b137ee56ef916bb7da3b140201c970f6d509c1cb86c0c95',
  },
  {
    target: 'ger',
    originalDescription: 'Hashek',
    translatedDescription: 'Hashek',
    hashCode:
      'ee5554c359ce33a05b5b91dd39983e23389a4ba26bc90eb884d9e02dc689e656',
  },
  {
    target: 'ger',
    originalDescription: 'Khoppe',
    translatedDescription: 'Khoppe',
    hashCode:
      '9ee227068c7063fa7d2c76027ce622293c798f9e72e42437fef91a5b36850ffa',
  },
  {
    target: 'ger',
    originalDescription: 'Dobrescu',
    translatedDescription: 'Dobrescu',
    hashCode:
      '4b3d6f910df166d4543ede9e232a35bc8ca2f2def815106b684df402bb00052a',
  },
  {
    target: 'ger',
    originalDescription: 'Boshard',
    translatedDescription: 'Boshard',
    hashCode:
      'b74fa3bcfd08f1abe159ad4fe10c6ed516d5445bb06a8590df4e09920343f177',
  },
  {
    target: 'ger',
    originalDescription: 'Salkind',
    translatedDescription: 'Salkind',
    hashCode:
      'a6fb928511bb68042792c032105951a1e9870396cd634120572bd5d6841c8b51',
  },
  {
    target: 'ger',
    originalDescription: 'Muterd',
    translatedDescription: 'Muterd',
    hashCode:
      '3b97d4099034a5c9a79f3b4f0c4c5e329ece472ea9c212afe69565a4f27bbbef',
  },
  {
    target: 'ger',
    originalDescription: 'Raina',
    translatedDescription: 'Raina',
    hashCode:
      'b0d543af330c2df5a4c5c40ea8b810fcaae510f2013fa53f06717c658327c64c',
  },
  {
    target: 'ger',
    originalDescription: 'Kweckenstedt',
    translatedDescription: 'Kweckenstedt',
    hashCode:
      '856037104b4e66b68e37328aeff4d4203bc627851a6b23c5301225b5d9315be8',
  },
  {
    target: 'ger',
    originalDescription: 'Seleznev',
    translatedDescription: 'Seleznev',
    hashCode:
      '1eeabe7c5c71dacad1ac708c388cee50ca566fc21251f0d29d5ded0e34a8eeb5',
  },
  {
    target: 'ger',
    originalDescription: 'Bekster',
    translatedDescription: 'Bekster',
    hashCode:
      'acd6ebd8bf6bc16a7950ead176cbcc12394321e7e6d3f7fb180ae94701ccb552',
  },
  {
    target: 'ger',
    originalDescription: 'Douson',
    translatedDescription: 'Douson',
    hashCode:
      '3ae0d15ec8d4081690400fac6ac24cc7839f9be12d3798f8df0b4d3ddf632cfd',
  },
  {
    target: 'ger',
    originalDescription: 'Sivkov',
    translatedDescription: 'Sivkov',
    hashCode:
      'a2a9ab3c885fc57e51b93565a0c98094d5613935474277a90eeedb1fb7a4ff8b',
  },
  {
    target: 'ger',
    originalDescription: 'Herbstmann&Gorgiev',
    translatedDescription: 'Herbstmann&Gorgiev',
    hashCode:
      '640bc599535e1c46a9a2d4d984d29bee2d5f8fb30382f84bac3fc3372f0c3c8f',
  },
  {
    target: 'ger',
    originalDescription: 'Elinek',
    translatedDescription: 'Elinek',
    hashCode:
      '4b26bb9c26ce9555b77e62f8fbbd873763e3687a3d5896806fb921b2aee91435',
  },
  {
    target: 'ger',
    originalDescription: 'Robinzon',
    translatedDescription: 'Robinzon',
    hashCode:
      '86ef3980348bf1f112950573d4e43b0c2a91156e8509d1047cf96f7af414131a',
  },
  {
    target: 'ger',
    originalDescription: 'Terkho',
    translatedDescription: 'Terkho',
    hashCode:
      'ce29c9fc256f17f6e74d2a1e70956cd9241f35a414e8ec06753bb54aabd84847',
  },
  {
    target: 'ger',
    originalDescription: 'Rusenescu',
    translatedDescription: 'Rusenescu',
    hashCode:
      'c1beba41913401e08dd254371391111adc647cf0c0ef6551f89998f1fdb19979',
  },
  {
    target: 'ger',
    originalDescription: 'Gon',
    translatedDescription: 'Gon',
    hashCode:
      '5e0e5ddfda4ae91bad2a92d306c574eee3f3bd33516632e75b3af4bd99388d89',
  },
  {
    target: 'ger',
    originalDescription: 'Mattei',
    translatedDescription: 'Mattei',
    hashCode:
      'af61f331a4b3ef942dfd840cfa1395f9e8a66f882ed33ad553c2deeb645233f0',
  },
  {
    target: 'ger',
    originalDescription: 'Lafora',
    translatedDescription: 'Lafora',
    hashCode:
      '19c8581e96b59670bba97c28fc884e11de832939eebab12ea355eda82244cf7b',
  },
  {
    target: 'ger',
    originalDescription: 'Dorogov',
    translatedDescription: 'Dorogov',
    hashCode:
      'e234a98dfef6bd62d7b1c79dbc42641a021391510daea10be0d0a8c6ce7a347a',
  },
  {
    target: 'ger',
    originalDescription: 'Van Breukelen',
    translatedDescription: 'Van Breukelen',
    hashCode:
      'bd22d89ee4f5ca80d19a78a63519dd5e70f750c9e5d5fd4794723558106113ae',
  },
  {
    target: 'ger',
    originalDescription: 'Daniel',
    translatedDescription: 'Daniel',
    hashCode:
      'bd3dae5fb91f88a4f0978222dfd58f59a124257cb081486387cbae9df11fb879',
  },
  {
    target: 'ger',
    originalDescription: 'Chekhover',
    translatedDescription: 'Chekhover',
    hashCode:
      '9f67aa37cc68df7d59e3a6583a46cad81bc1e71334656b10e4f261ee0ae9326f',
  },
  {
    target: 'ger',
    originalDescription: 'Koshek',
    translatedDescription: 'Koshek',
    hashCode:
      '255c915c2a8b164dad558ca98d4095104d0775f13d670ddfd4ac4c02017490dd',
  },
  {
    target: 'ger',
    originalDescription: 'Denesh',
    translatedDescription: 'Denesh',
    hashCode:
      '2db46cce2a6046d101afdda3ae009b1d7d98a60d2206d0b22eb8d2f859d8960e',
  },
  {
    target: 'ger',
    originalDescription: 'Kalinin',
    translatedDescription: 'Kalinin',
    hashCode:
      'ba9937eb1af68bf0797f6e8f2122978eb53cd2a8589207789d45df5241bdb5ad',
  },
  {
    target: 'ger',
    originalDescription: 'Dimentberg',
    translatedDescription: 'Dimentberg',
    hashCode:
      '78cfd30fe1c516d22bd41072b853547cc2c3942ba3fd84eb6e3c626868879bf1',
  },
  {
    target: 'ger',
    originalDescription: 'Moberg',
    translatedDescription: 'Moberg',
    hashCode:
      '46c875d0e56eaa2c0639ade1052df8d63f82a8d945c4778532ccee5d3f7bce1f',
  },
  {
    target: 'ger',
    originalDescription: 'Vukovic',
    translatedDescription: 'Vukovic',
    hashCode:
      '2b92ed70f42a303622bed22d4168bd01914217dd076d8b59791d61fd1a554b54',
  },
  {
    target: 'ger',
    originalDescription: 'Bondarenko&Liburkin',
    translatedDescription: 'Bondarenko&Liburkin',
    hashCode:
      '7952ddc61f87c8a5754a0c4ab701c9eae0c8f87038f19a2cd7a02f6273243c0b',
  },
  {
    target: 'ger',
    originalDescription: 'Tjavolsky',
    translatedDescription: 'Tjavolsky',
    hashCode:
      'fe64bdc91f2598ed18eeb5bf76707b88f7ae31cde3da305829d5d89ecc50158c',
  },
  {
    target: 'ger',
    originalDescription: 'Maksimovskikh',
    translatedDescription: 'Maksimovskikh',
    hashCode:
      '7c8e46cb6dff51dbe25f426e2db7042dfa3daa87b5ead7da0f4dfb67dde6697f',
  },
  {
    target: 'ger',
    originalDescription: 'Aloni',
    translatedDescription: 'Aloni',
    hashCode:
      'bcc200e73de6304b3d2b43171f934233b2ba0fc72ea69dad59f377b8dacd3772',
  },
  {
    target: 'ger',
    originalDescription: 'NN',
    translatedDescription: 'NN',
    hashCode:
      'fab66aa01347d3f11a16468941378cea495937e5f482e18ea6472681e03d3936',
  },
  {
    target: 'ger',
    originalDescription: 'Bledov',
    translatedDescription: 'Bledov',
    hashCode:
      '0938df9776813a28d58d7a73505c8b50e15b63746d2d536e4e81f4f44198a49f',
  },
  {
    target: 'ger',
    originalDescription: 'Sevitov',
    translatedDescription: 'Sevitov',
    hashCode:
      '747a090e9467dd6e4e40777ceae408b923568dd4e2943645504ea91a08e0f5f5',
  },
  {
    target: 'ger',
    originalDescription: 'Kionka',
    translatedDescription: 'Kionka',
    hashCode:
      '5b8999ef8f6a031175c676dbb1990146e451bb61f4ce074cff55b3b8cc8ccd2c',
  },
  {
    target: 'ger',
    originalDescription: 'Djala',
    translatedDescription: 'Djala',
    hashCode:
      'e1b09f9c43700ef7a5308f62b8ca35c4003bd53408fbc28da4a22cbac76b33bc',
  },
  {
    target: 'ger',
    originalDescription: 'Kheiskanen',
    translatedDescription: 'Kheiskanen',
    hashCode:
      'f545d6b432fd6beed79423a0ed14ca3fcecb9cf07975c2341691ec29a5934350',
  },
  {
    target: 'ger',
    originalDescription: 'Babic',
    translatedDescription: 'Babic',
    hashCode:
      'e9168a74df19b5baa4de19d9e5421b53e24c3a928c0425b2dd3c331c3662c6f9',
  },
  {
    target: 'ger',
    originalDescription: 'Erlich',
    translatedDescription: 'Erlich',
    hashCode:
      '5eda0276a668c7e92a8e8bafa9f90b409c9115195b28b81201675a028602de28',
  },
  {
    target: 'ger',
    originalDescription: 'Aitov&Pogosiants',
    translatedDescription: 'Aitov&Pogosiants',
    hashCode:
      '3e5db7c3a43c8e1d648c36097dd7b50ed6e296efb9c5c54b92b98deac18e0705',
  },
  {
    target: 'ger',
    originalDescription: 'Gorgiev',
    translatedDescription: 'Gorgiev',
    hashCode:
      '81bd01a31c45807d98467497fc0f38e47db80868991ed8fb46e0825410be2d7b',
  },
  {
    target: 'ger',
    originalDescription: 'Frankl',
    translatedDescription: 'Frankl',
    hashCode:
      '54a70d47604cbf2ada7fdbb36bc20b2ff61d27a2656d87a5a0d491aa2e99a872',
  },
  {
    target: 'ger',
    originalDescription: 'Khufendik',
    translatedDescription: 'Khufendik',
    hashCode:
      'd563e7fd98424d4370002b2ddbe0639731d94326be20e8103df0f6a5b58839d8',
  },
  {
    target: 'ger',
    originalDescription: 'Rossi',
    translatedDescription: 'Rossi',
    hashCode:
      '30cc6dd8ef8458e679e13ae3bf3f634cace9810e2eea03bb6487904595f41056',
  },
  {
    target: 'ger',
    originalDescription: 'Korteling',
    translatedDescription: 'Korteling',
    hashCode:
      '5485cb5a4c215c929dcda2f2c27961197f2ccc33575fe8ab7d75beb33016d39d',
  },
  {
    target: 'ger',
    originalDescription: 'Afanasiev&Dvizov',
    translatedDescription: 'Afanasiev&Dvizov',
    hashCode:
      '1ef25c998cd6885d1fa222152ec1a30cc8d7b84d4fb1f918ac6355e564078985',
  },
  {
    target: 'ger',
    originalDescription: 'Bondarev',
    translatedDescription: 'Bondarev',
    hashCode:
      '4b3bea164e8a60c69bab694944d626439aeb0ad8b20273a351a9a71c19809a26',
  },
  {
    target: 'ger',
    originalDescription: 'Laisaari',
    translatedDescription: 'Laisaari',
    hashCode:
      '353f5e3d6c10183e3e4cd470e2b737e19653db454cfb40f819bb73fc7a4c8391',
  },
  {
    target: 'ger',
    originalDescription: 'Keydansky',
    translatedDescription: 'Keydansky',
    hashCode:
      '7e8b79c93dcda47faf9bcc2ee7b25416ca9f479349d875cb2193a4baa805c764',
  },
  {
    target: 'ger',
    originalDescription: 'Gudeus',
    translatedDescription: 'Gudeus',
    hashCode:
      '85585f9f6f016691ebbaefbd830faae92980cc48e296633d9a1060b0bf4f9b40',
  },
  {
    target: 'ger',
    originalDescription: 'Kon',
    translatedDescription: 'Kon',
    hashCode:
      'e34b888158c5041d4eb382b1f3f766bc498245a0ab8a74926df787f0fe860205',
  },
  {
    target: 'ger',
    originalDescription: 'Schmidt',
    translatedDescription: 'Schmidt',
    hashCode:
      'c7311d4137b8a37bc1218bec360eba3db8a7a297a82b25f063547054036838e3',
  },
  {
    target: 'ger',
    originalDescription: 'Benhardt',
    translatedDescription: 'Benhardt',
    hashCode:
      '71a4413883ea3679464596cf5254fd8376de3401ff400fad01c5be1d226c786a',
  },
  {
    target: 'ger',
    originalDescription: 'Chikovani',
    translatedDescription: 'Chikovani',
    hashCode:
      'f73a7474cfcba66495deb8738a7b777e3d51f7a8c1557ca24ea73551364773a5',
  },
  {
    target: 'ger',
    originalDescription: 'Nadareishvili',
    translatedDescription: 'Nadareishvili',
    hashCode:
      'aec50916df3990efa92a2ee4f0a8cc7a927eeeabbc3f3707f2f3f943337d66ae',
  },
  {
    target: 'ger',
    originalDescription: 'Khortov',
    translatedDescription: 'Khortov',
    hashCode:
      '7f40890813def07a7bb42b84a756bfb178e067b25ad343b7117a1a7bb6665141',
  },
  {
    target: 'ger',
    originalDescription: 'Kuriatnikov',
    translatedDescription: 'Kuriatnikov',
    hashCode:
      'b17ae1993bf437510ed84889562e9aa9f99cfe3729609e2b8ef8398a02471be6',
  },
  {
    target: 'ger',
    originalDescription: 'Kovalenko',
    translatedDescription: 'Kovalenko',
    hashCode:
      '1a81d9b44ae8faedf11d817c35c4dd19060e5d32a4dc58ce42f3149cc516ef5a',
  },
  {
    target: 'ger',
    originalDescription: 'Grunfeld',
    translatedDescription: 'Grunfeld',
    hashCode:
      '2e4bce7a08025613b4c6b085f678e4e1215de7013eea39078ecf85f51674a41f',
  },
  {
    target: 'ger',
    originalDescription: 'Kisling',
    translatedDescription: 'Kisling',
    hashCode:
      '6fc208ef1612790b228edb181d67385835bdbfe9ce54aedd9554a1db375b4e8b',
  },
  {
    target: 'ger',
    originalDescription: 'Klausen',
    translatedDescription: 'Klausen',
    hashCode:
      'aaa4303920731899ad16ef10dde066de2e73b08b157b7fb5117ef33d446e6c7d',
  },
  {
    target: 'ger',
    originalDescription: 'Romanovsky',
    translatedDescription: 'Romanovsky',
    hashCode:
      '91dd9da02d6fef3a5c59356b04776e0449a622b51dff4e7f95d0fd34f3e65063',
  },
  {
    target: 'ger',
    originalDescription: 'Liungmann',
    translatedDescription: 'Liungmann',
    hashCode:
      '18148a9410c9c971ac7fad2e5b0e06f68d642a6968a64ebbf0db1c38e15350ab',
  },
  {
    target: 'ger',
    originalDescription: 'Proskurovsky',
    translatedDescription: 'Proskurovsky',
    hashCode:
      'ebb32b9a0afd1dc3c8921e648b39672ca851029fa01adcad255e7559285c90f5',
  },
  {
    target: 'ger',
    originalDescription: 'E.Lasker',
    translatedDescription: 'E.Lasker',
    hashCode:
      'd66961d4d15f65bcd6f276066591649071c6bf6b43602fe6966da76c131683c7',
  },
  {
    target: 'ger',
    originalDescription: 'P.keres',
    translatedDescription: 'P.keres',
    hashCode:
      '068310970a3d61bc55b53d5d3696ebb4c369797529b040cbe63ca6da639cfc60',
  },
  {
    target: 'ger',
    originalDescription: 'Kopaev',
    translatedDescription: 'Kopaev',
    hashCode:
      'a6bad0eb59a0c294bad34188326f54e91c5a0aa71567a6d2f743699d5b659ce1',
  },
  {
    target: 'ger',
    originalDescription: 'Van Reek',
    translatedDescription: 'Van Reek',
    hashCode:
      'a4601f17defaaa61f8521b25c227a4f15f58318cdf894f2d35493af22ff41c72',
  },
  {
    target: 'ger',
    originalDescription: 'V.Platov',
    translatedDescription: 'V.Platov',
    hashCode:
      '869ca05cdeaa33f0518cb2a3eaa13442af1b4d2732ef5bcb9acca3d0a908cf63',
  },
  {
    target: 'ger',
    originalDescription: 'Louma',
    translatedDescription: 'Louma',
    hashCode:
      'e1abb41122a6d9b487f6fefb43918731cafb205758de6b70b5e3c8c68d8035d6',
  },
  {
    target: 'ger',
    originalDescription: 'Kapfer',
    translatedDescription: 'Kapfer',
    hashCode:
      'f123bed5f0f96cbea7af5a7f4e6350db2b45e35f1db0f3f14eb75e7c864da30d',
  },
  {
    target: 'ger',
    originalDescription: 'Pekkover',
    translatedDescription: 'Pekkover',
    hashCode:
      '06db9a25d228813cefa98641024fdcd5ccd9ec12d95448a6dc47c0dcf64683d3',
  },
  {
    target: 'ger',
    originalDescription: 'Narania',
    translatedDescription: 'Narania',
    hashCode:
      '30cdddba12ea054ad2ba3667fb7808cae6210e669c0bdf5bb52f4fd770666880',
  },
  {
    target: 'ger',
    originalDescription: 'Vik',
    translatedDescription: 'Vik',
    hashCode:
      '3bc508d48b0c83ec09d4230985d0b36d432dd3cc432b1192ffb9b9d0b6759418',
  },
  {
    target: 'ger',
    originalDescription: 'Johansson',
    translatedDescription: 'Johansson',
    hashCode:
      'f3ceec9a1cced1c2c2702729b826acdd8c8269e4459604fdf9e99ca39f471342',
  },
  {
    target: 'ger',
    originalDescription: 'Grondiys',
    translatedDescription: 'Grondiys',
    hashCode:
      '82faf026032b05ccffd4f1f161e9ad3e7b0049144bd470339b55ca1effcf4ba3',
  },
  {
    target: 'ger',
    originalDescription: 'Karr',
    translatedDescription: 'Karr',
    hashCode:
      'd060093334aa074e70e37f6e9f149dec3c450dedc6a72ecf5db1fa7de9d221ee',
  },
  {
    target: 'ger',
    originalDescription: 'Karstedt',
    translatedDescription: 'Karstedt',
    hashCode:
      '8192810ea327e85b891438af0e8ba14115944fa1a0788bdf1d89c6aab2e8b9d3',
  },
  {
    target: 'ger',
    originalDescription: 'Neistadtl',
    translatedDescription: 'Neistadtl',
    hashCode:
      'd0293ac38a939d89e0250f53a88be6a7e528a20d7983c86f96f4240f4fb09e4b',
  },
  {
    target: 'ger',
    originalDescription: 'Voia',
    translatedDescription: 'Voia',
    hashCode:
      'c8ff042b4429c42d01d92a9ff61faa9195aa87be39f17a5c18ae1deac44a56fb',
  },
  {
    target: 'ger',
    originalDescription: 'Matisson',
    translatedDescription: 'Matisson',
    hashCode:
      '923406b212e522c31f07058771cde77bd46e6bcea7031d2a7b1664c1c0efd439',
  },
  {
    target: 'ger',
    originalDescription: 'Didrikhson',
    translatedDescription: 'Didrikhson',
    hashCode:
      'd5b5e776b50905c4ec5f98fe878dfd2e9ca965b8f457cac63fcc920346316843',
  },
  {
    target: 'ger',
    originalDescription: 'Nevitsky',
    translatedDescription: 'Nevitsky',
    hashCode:
      '452ffa43edfb779de63e4aa229a62a5613c04627462ac4e387077dfe16ce405b',
  },
  {
    target: 'ger',
    originalDescription: 'Kalandadze',
    translatedDescription: 'Kalandadze',
    hashCode:
      '07cee69da156b697b1f56126cd4ffaf2e272dbdbe2db953701f53c6fa03e5861',
  },
  {
    target: 'ger',
    originalDescription: 'Kling',
    translatedDescription: 'Kling',
    hashCode:
      '8a105898989c6e17a605bdf926376050dd431701f4240ea084fc1c1d342cc848',
  },
  {
    target: 'ger',
    originalDescription: 'Matison',
    translatedDescription: 'Matison',
    hashCode:
      'fb5c6defb4a939845e2ba5acb30ce249f5a012a6ac2f6a35c03625e4acd5f0f2',
  },
  {
    target: 'ger',
    originalDescription: 'Vilnev-Esklapon',
    translatedDescription: 'Vilnev-Esklapon',
    hashCode:
      'eebd8243c473ca8aaa2ff9c54082eae964728aa0ecf4385b567a6fcc73e81b1a',
  },
  {
    target: 'ger',
    originalDescription: 'Betinsh',
    translatedDescription: 'Betinsh',
    hashCode:
      '374b79af60fc969b8ea53fbbb4605813e77eff867b8ebcb814977a9ac10ad511',
  },
  {
    target: 'ger',
    originalDescription: 'Vandekastelle',
    translatedDescription: 'Vandekastelle',
    hashCode:
      'e3dc3b43426adaaac91a07dbaa8c4ed085593162a10b9b086328928877586d8f',
  },
  {
    target: 'ger',
    originalDescription: 'Vanchura',
    translatedDescription: 'Vanchura',
    hashCode:
      '88511e0c5763972c820c6262db0011394394e86204e072742c0988888ba363b4',
  },
  {
    target: 'ger',
    originalDescription: 'Korani',
    translatedDescription: 'Korani',
    hashCode:
      'fab00acc379025d3e7cb77a8d643103258fd2ebcceef31a5e6764125bb39a6c2',
  },
  {
    target: 'ger',
    originalDescription: 'Balach',
    translatedDescription: 'Balach',
    hashCode:
      '37ba451ac0b3cb3b842bb568951ac58cf1a908ac12ef1d0e4714eb72c726441e',
  },
  {
    target: 'ger',
    originalDescription: 'Akchurin',
    translatedDescription: 'Akchurin',
    hashCode:
      '15efca8c5956c4e99723dcdbf20eeac9326677e611e17320e29bd276a6f08d48',
  },
  {
    target: 'ger',
    originalDescription: 'Bron',
    translatedDescription: 'Bron',
    hashCode:
      'aac6544421eed64632caadfb2018539328b283b30cacbcc23266635ff0e9cb56',
  },
  {
    target: 'ger',
    originalDescription: 'Kopelomiaki',
    translatedDescription: 'Kopelomiaki',
    hashCode:
      '5528021fe67fdd984e352dff3f46b9517c03d32ee2eef991b8a11cf1367b76d2',
  },
  {
    target: 'ger',
    originalDescription: 'Dolgov',
    translatedDescription: 'Dolgov',
    hashCode:
      '1d4d978e6b7bdfbe26a4e5fdb5d19a3bb32930930dc10f95bd01f6c148c6110b',
  },
  {
    target: 'ger',
    originalDescription: 'Krzhivitsky',
    translatedDescription: 'Krzhivitsky',
    hashCode:
      'cae091f65acac080333c39d66110ffaf5371f7870fb59cb7b02caf08d321dc9b',
  },
  {
    target: 'ger',
    originalDescription: 'Vilnev&Esklapon',
    translatedDescription: 'Vilnev&Esklapon',
    hashCode:
      '1fd66539c425e9fdd41ef38f329542a242201ea0e7c66425b670213bf2006dc1',
  },
  {
    target: 'ger',
    originalDescription: 'I.Taimanov',
    translatedDescription: 'I.Taimanov',
    hashCode:
      '3dbe7688a7f711e497cff85843e92cd23eaa0f075eb63bdb0b512ddddf515258',
  },
  {
    target: 'ger',
    originalDescription: 'Gretzer',
    translatedDescription: 'Gretzer',
    hashCode:
      'ccfde22f606cf57fbf7d5abb689210f892fe4384040f5c6cd3f2965458fa0a9a',
  },
  {
    target: 'ger',
    originalDescription: 'Krelin',
    translatedDescription: 'Krelin',
    hashCode:
      'c0ce10aaaecc8c12a0d1d8a5298b9b3fca14dc5a7c758d28ef18fb61e62750c7',
  },
  {
    target: 'ger',
    originalDescription: 'kljatskin',
    translatedDescription: 'kljatskin',
    hashCode:
      'dc2b1b4d613ec978a4602c201e41cc1cc6e5ffe185c598028a4a31f7b1151ccb',
  },
  {
    target: 'ger',
    originalDescription: 'Prevorovsky',
    translatedDescription: 'Prevorovsky',
    hashCode:
      'f79afaa46e8cd51dd36af7cc443abbb011f0e0bb0560522cf7826a87515a3807',
  },
  {
    target: 'ger',
    originalDescription: 'Koster',
    translatedDescription: 'Koster',
    hashCode:
      'a9ed03d1bd78bbd8f9864ee7a886308a4076d2f46eb9b42107ec7fd90890ccce',
  },
  {
    target: 'ger',
    originalDescription: 'Khaga',
    translatedDescription: 'Khaga',
    hashCode:
      '5ce808db239ae70f3d08753ba6c1124d4d82111cd79276aecaad89c639b5948b',
  },
  {
    target: 'ger',
    originalDescription: 'Kasparian&Iakimchik',
    translatedDescription: 'Kasparian&Iakimchik',
    hashCode:
      '7aff4524ff017567c508e7255685e02ffa4ce7e130dab81d3ec5c41ffda2147f',
  },
  {
    target: 'ger',
    originalDescription: 'Aitov',
    translatedDescription: 'Aitov',
    hashCode:
      '3afe2d8a772a5c7137b34af55e911b0804facf92360910f3885ea0146c894ba7',
  },
  {
    target: 'ger',
    originalDescription: 'Pukhakka',
    translatedDescription: 'Pukhakka',
    hashCode:
      '53a12b821b68cd694e44c88821ff0c7e905a897b5217d2a77dd55f75e2b940bf',
  },
  {
    target: 'ger',
    originalDescription: 'B.Lasker',
    translatedDescription: 'B.Lasker',
    hashCode:
      'b55ad3d31b75e8ddc56734d6bc562a66d89606271712ab72c414f27e5849a748',
  },
  {
    target: 'ger',
    originalDescription: 'Kozlovsky',
    translatedDescription: 'Kozlovsky',
    hashCode:
      'b07968b38a7c76d5db90dbad89056434d68c92e2289872884e89a5873e81089c',
  },
  {
    target: 'ger',
    originalDescription: 'Preskurovsky',
    translatedDescription: 'Preskurovsky',
    hashCode:
      'dba235eee8f0e9921b983ce42c89b54516e9bb50dfc846b01d41b6af34fad311',
  },
  {
    target: 'ger',
    originalDescription: 'Berngardt',
    translatedDescription: 'Berngardt',
    hashCode:
      '853e6aea43cdec242581e4ba46311b863d848d02db820565c18a27b8743683cb',
  },
  {
    target: 'ger',
    originalDescription: 'Belikov',
    translatedDescription: 'Belikov',
    hashCode:
      '17867f0db738fc9c9e3a88227196d02aebcc8aa45a73883240bad94fed8a245b',
  },
  {
    target: 'ger',
    originalDescription: 'Neiman',
    translatedDescription: 'Neiman',
    hashCode:
      'ad4b388c696c4250ecbaeae38d3fe23ed23028fd45c234935b88896ec6a5b236',
  },
  {
    target: 'ger',
    originalDescription: 'Sivak',
    translatedDescription: 'Sivak',
    hashCode:
      '8a068378c83e8b21025a1e86f4cd07dd71b437dc8600fe840690ff9a88947c9e',
  },
  {
    target: 'ger',
    originalDescription: 'Beslei',
    translatedDescription: 'Beslei',
    hashCode:
      'a66b41ce19868b3e981ee5124500e6fa82c91252005416e635f6c4912b8f5446',
  },
];
