import * as T from 'three';
type Entry={mesh:T.Mesh;root:T.Group;batch:T.InstancedMesh;index:number};
/** Exact shared geometry and materials; spatial chunks retain offscreen culling. */
export class StaticInstances{
  private entries:Entry[]=[];private batches:T.InstancedMesh[]=[];
  private transforms=new Map<T.Group,T.Matrix4>();
  private roots:T.Group[]=[];private key='';private zero=new T.Matrix4().makeScale(0,0,0);
  constructor(private scene:T.Scene){}
  sync(buildings:ReadonlyMap<number,T.Group>,board:ReadonlyMap<number,string>){
    const roots=[...buildings].filter(([id])=>['house','manor','store','lumber','fisher'].includes(board.get(id)??'')).map(([,root])=>root);
    const key=roots.map(root=>root.uuid+':'+root.children.length).join('|');if(key===this.key)return;
    this.clear();this.key=key;this.roots=roots;
    const groups=new Map<string,{mesh:T.Mesh;root:T.Group}[]>();
    for(const root of roots)root.traverse(object=>{
      let parent:T.Object3D|null=object;while(parent&&parent!==root){if(parent.userData.upgradedAt!==undefined)return;parent=parent.parent}
      if(!(object instanceof T.Mesh)||!object.visible||!(object.material instanceof T.MeshStandardMaterial))return;
      const key=[Math.floor(root.position.x/12),Math.floor(root.position.z/12),object.geometry.uuid,object.material.uuid,object.castShadow,object.receiveShadow].join(':');
      if(!groups.has(key))groups.set(key,[]);groups.get(key)!.push({mesh:object,root});
    });
    for(const group of groups.values()){
      if(group.length<2)continue;
      const first=group[0].mesh,batch=new T.InstancedMesh(first.geometry,first.material,group.length);
      batch.castShadow=first.castShadow;batch.receiveShadow=first.receiveShadow;batch.instanceMatrix.setUsage(T.DynamicDrawUsage);
      this.scene.add(batch);this.batches.push(batch);
      group.forEach((entry,index)=>{entry.mesh.visible=false;this.entries.push({...entry,batch,index})});
    }
  }
  update(){
    const changed=new Set<T.Group>(),dirty=new Set<T.InstancedMesh>();
    for(const root of this.roots){
      root.updateWorldMatrix(true,false);
      const previous=this.transforms.get(root);
      const visible=root.visible?1:0;
      if(!previous||!previous.equals(root.matrixWorld)||root.userData.instanceVisibility!==visible){
        root.updateWorldMatrix(false,true);changed.add(root);this.transforms.set(root,root.matrixWorld.clone());root.userData.instanceVisibility=visible;
      }
    }
    for(const entry of this.entries)if(changed.has(entry.root)){
      entry.batch.setMatrixAt(entry.index,entry.root.visible?entry.mesh.matrixWorld:this.zero);dirty.add(entry.batch);
    }
    for(const batch of dirty){batch.instanceMatrix.needsUpdate=true;batch.computeBoundingSphere()}
  }
  clear(){
    for(const entry of this.entries)entry.mesh.visible=true;
    for(const batch of this.batches){this.scene.remove(batch);batch.dispose()}
    this.entries=[];this.batches=[];this.roots=[];this.transforms.clear();this.key='';
  }
}
