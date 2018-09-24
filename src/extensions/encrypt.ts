import * as Gun from 'gun/gun';

Gun.chain.encrypt = function(data: any, cb?: any){
    var gun = this, user = gun.back(-1).user(), pair = user.pair(), path = '';
    gun.back(function(at: any){ if(at.pub){ return } path += (at.get||'') });
    (async function(){
        var enc, sec = await user.get('trust').get(pair.pub).get(path).then();
        sec = await Gun.SEA.decrypt(sec, pair);
        if(!sec){
            sec = Gun.SEA.random(16).toString();
            enc = await Gun.SEA.encrypt(sec, pair);
            user.get('trust').get(pair.pub).get(path).put(enc);
        }
        enc = await Gun.SEA.encrypt(data, sec);
        gun.set(enc, cb);
    }());
    return gun;
};
