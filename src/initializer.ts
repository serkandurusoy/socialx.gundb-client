import * as Gun from 'gun/gun';
import 'gun/lib/store'; // temp and should be removed (just for offline testing on node)
import 'gun/lib/then';

export const gun: GunObj = new Gun("http://localhost:1337/gun");

const rel_ = Gun.val.rel._;  // '#'
const node_ = Gun.node._;  // '_'

// equivelent to node.get(node #).put(null)
Gun.chain.unset = (node: any) => {
	if( this && node && node[node_] && node[node_].put && node[node_].put[node_] && node[node_].put[node_][rel_] )
		this.put( { [node[node_].put[node_][rel_]]:null} );
	return this;
}