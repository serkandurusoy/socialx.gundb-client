import * as Gun from 'gun/gun';
import 'gun/lib/store'; // temp and should be removed (just for offline testing on node)
import 'gun/lib/then';
import 'gun/sea';
import './docload';

export const gun: GunInstance = new Gun("http://localhost:1337/gun");
export const user = gun.user();

const rel_ = Gun.val.rel._;  // '#'
const node_ = Gun.node._;  // '_'

// equivelent to node.get(node #).put(null)
Gun.chain.unset = function(node: any) {
	if( this && node && node[node_] && node[node_].put && node[node_].put[node_] && node[node_].put[node_][rel_] )
		this.put( { [node[node_].put[node_][rel_]]:null} );
	return this;
}