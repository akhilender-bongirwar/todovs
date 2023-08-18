import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne} from 'typeorm';
import { User } from "./User";
@Entity()
export class Todo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text") 
    content!: string;

    @Column("boolean",{default:false})
    completed!: boolean;

    @Column()
    creatorId!: number;
  
    @ManyToOne(() => User, (u) => u.todos)
    @JoinColumn({ name: "creatorId" })
    creator!: Promise<User>;

}
