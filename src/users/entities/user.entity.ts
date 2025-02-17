import {
    AfterInsert,
    AfterRemove,
    AfterUpdate,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    JoinColumn,
    Repository,
    ManyToOne,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/user_roles/entities/user_role.entity';
import { Client } from 'src/clients/entities/client.entity';
import { ClientIccid } from 'src/client_iccids/entities/client_iccid.entity';
import * as crypto from 'crypto';

@Entity('users')
export class User {
    private static readonly ENCRYPTION_KEY = Buffer.from(
        process.env.ENCRYPTION_KEY || 'your-fallback-encryption-key-min-32-chars!!',
        'utf8'
    ).slice(0, 32);

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty({ message: 'Ingresa tu nombre' })
    @IsString()
    @Column()
    username: string;

    @Column({ nullable: true })
    username_hash: string;


    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ nullable: true })
    email_hash: string;

    @Column({ type: 'varchar', length: 255 })
    phone: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    clientLevel?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @Exclude()
    password: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    externalId?: string;

    @Column()
    permission: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'isActive', type: 'boolean', default: true })
    IsActive: boolean;

    @Column({ nullable: true })
    externalPlatformId: number;

    @Column({ type: 'integer', nullable: true })
    clientId?: number;

    @ManyToOne(() => Client, (client) => client.users)
    @JoinColumn({ name: 'clientId' })
    client?: Client;

    @OneToMany(() => UserRole, (userRole) => userRole.user)
    userRoles: UserRole[];

    @OneToMany(() => ClientIccid, (clientIccid) => clientIccid.user)
    clientIccids: ClientIccid[];

    // Private helper methods for encryption/decryption
    public encryptField(text: string): string {
        if (!text) return text;
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(
            'aes-256-cbc',
            Buffer.from(User.ENCRYPTION_KEY),
            iv,
        );
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted + ':' + iv.toString('hex');
    }

    public decryptField(encryptedText: string): string {
        if (!encryptedText) return encryptedText;
        try {
            const [encrypted, ivHex] = encryptedText.split(':');
            const iv = Buffer.from(ivHex, 'hex');
            const decipher = crypto.createDecipheriv(
                'aes-256-cbc',
                Buffer.from(User.ENCRYPTION_KEY),
                iv,
            );
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (error) {
            return encryptedText; // Return original text if it's not encrypted
        }

    }
    public hashField(text: string): string {

        return crypto.createHash('sha256').update(text).digest('hex');
    }

    @BeforeInsert()
    @BeforeUpdate()
    encryptFields() {
        if (this.username) {
            // Guardamos el username original en una constante
            const originalUsername = this.username;
            //console.log('ENTITY originalUsername', originalUsername);
            
            // Generamos el hash y lo guardamos en username_hash
            const hashedUsername = this.hashField(originalUsername);
            this.username_hash = hashedUsername;
            //console.log('ENTITY hashedUsername', hashedUsername);
            //console.log('ENTITY originalUsername', originalUsername);
            
            // Encriptamos y lo guardamos en username
            const encryptedUsername = this.encryptField(originalUsername);
            this.username = encryptedUsername;
           // console.log('ENTITY encryptedUsername', encryptedUsername);
        }
        if (this.email) {
            const originalEmail = this.email;
            this.email_hash = this.hashField(originalEmail);
            this.email = this.encryptField(originalEmail);
           // console.log('ENTITY encryptedEmail', this.email);
           
        }
        if (this.phone) {
            this.phone = this.encryptField(this.phone);
        }
    }

    toJSON() {
      //  console.log('Decrypting:', this.username); // Para debug
        try {
            const obj = { ...this };
            if (obj.username) {
                obj.username = this.decryptField(obj.username);
            }
        if (obj.email) {
            obj.email = this.decryptField(obj.email);
        }
        if (obj.phone) {
            obj.phone = this.decryptField(obj.phone);
        }
        return obj;
        } catch (error) {
            console.error('Error decrypting fields:', error);
            return this;
        }
    }

    @AfterInsert()
    logInsert() {
        // console.log('Inserted User with id', this.id);
    }

    @AfterUpdate()
    logUpdate() {
        // console.log('Updated User with id', this.id);
    }

    @AfterRemove()
    logRemove() {
        // console.log('Removed User with id', this.id);
    }
}
