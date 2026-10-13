import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import config from '../config';

// Database connection
const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    logging: config.env === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// User model
interface UserAttributes {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'trader';
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role' | 'isActive' | 'lastLogin' | 'createdAt' | 'updatedAt'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public password!: string;
  public role!: 'admin' | 'user' | 'trader';
  public isActive!: boolean;
  public lastLogin!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'trader'),
      defaultValue: 'user',
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);

// API Key model
interface APIKeyAttributes {
  id: string;
  userId: string;
  key: string;
  name: string;
  platform: string;
  expiresAt: Date;
  isActive: boolean;
  lastUsed: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface APIKeyCreationAttributes extends Optional<APIKeyAttributes, 'id' | 'isActive' | 'lastUsed' | 'createdAt' | 'updatedAt'> {}

export class APIKey extends Model<APIKeyAttributes, APIKeyCreationAttributes> implements APIKeyAttributes {
  public id!: string;
  public userId!: string;
  public key!: string;
  public name!: string;
  public platform!: string;
  public expiresAt!: Date;
  public isActive!: boolean;
  public lastUsed!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

APIKey.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    lastUsed: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'api_keys',
    timestamps: true,
  }
);

// Audit Log model
interface AuditLogAttributes {
  id: string;
  userId: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  details: object;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure';
  createdAt: Date;
}

interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, 'id' | 'userId' | 'resourceId' | 'createdAt'> {}

export class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
  public id!: string;
  public userId!: string | null;
  public action!: string;
  public resource!: string;
  public resourceId!: string | null;
  public details!: object;
  public ipAddress!: string;
  public userAgent!: string;
  public status!: 'success' | 'failure';
  public readonly createdAt!: Date;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resource: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resourceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('success', 'failure'),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'audit_logs',
    timestamps: true,
    updatedAt: false,
  }
);

// Encrypted Credentials model
interface EncryptedCredentialAttributes {
  id: string;
  userId: string;
  type: 'mt5' | 'exchange' | 'api';
  name: string;
  encryptedData: string;
  createdAt: Date;
  updatedAt: Date;
}

interface EncryptedCredentialCreationAttributes extends Optional<EncryptedCredentialAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class EncryptedCredential extends Model<EncryptedCredentialAttributes, EncryptedCredentialCreationAttributes> implements EncryptedCredentialAttributes {
  public id!: string;
  public userId!: string;
  public type!: 'mt5' | 'exchange' | 'api';
  public name!: string;
  public encryptedData!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EncryptedCredential.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('mt5', 'exchange', 'api'),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    encryptedData: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'encrypted_credentials',
    timestamps: true,
  }
);

// Define relationships
User.hasMany(APIKey, { foreignKey: 'userId', as: 'apiKeys' });
APIKey.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(EncryptedCredential, { foreignKey: 'userId', as: 'credentials' });
EncryptedCredential.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Database initialization
export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models (use { alter: true } in development, { force: false } in production)
    await sequelize.sync({ alter: config.env === 'development' });
    console.log('Database models synchronized.');
    
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to database:', error);
    throw error;
  }
};

export { sequelize };
export default sequelize;
