from sqlalchemy.orm import Session
from typing import List, Optional

from src.backend.models.tenant import Tenant
from src.backend.dto.tenant_dto import TenantCreateDTO, TenantUpdateDTO

def get_tenant_by_id(db: Session, tenant_id: str) -> Optional[Tenant]:
    return db.query(Tenant).filter(Tenant.id == tenant_id).first()

def get_tenant_by_name(db: Session, name: str) -> Optional[Tenant]:
    return db.query(Tenant).filter(Tenant.name.ilike(name)).first()

def get_tenant_by_email(db: Session, email: str) -> Optional[Tenant]:
    return db.query(Tenant).filter(Tenant.contact_email == email).first()

def get_all_tenants(db: Session, skip: int = 0, limit: int = 100) -> List[Tenant]:
    return db.query(Tenant).offset(skip).limit(limit).all()

def create_tenant(db: Session, tenant_data: TenantCreateDTO) -> Tenant:
    db_tenant = Tenant(**tenant_data.model_dump())
    db.add(db_tenant)
    db.commit()
    db.refresh(db_tenant)
    return db_tenant

def update_tenant(db: Session, tenant_id: str, tenant_data: TenantUpdateDTO) -> Optional[Tenant]:
    db_tenant = get_tenant_by_id(db, tenant_id)
    if db_tenant:
        update_data = tenant_data.model_dump(exclude_unset=True) 
        for key, value in update_data.items():
            setattr(db_tenant, key, value)
        db.commit()
        db.refresh(db_tenant)
    return db_tenant

def delete_tenant(db: Session, tenant_id: str) -> bool:
    db_tenant = get_tenant_by_id(db, tenant_id)
    if db_tenant:
        db.delete(db_tenant)
        db.commit()
        return True
    return False