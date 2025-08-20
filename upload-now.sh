#!/bin/bash

# AP Repair System - GitHub Upload Script
# ใช้สำหรับอัปโหลดโปรเจคขึ้น GitHub

echo "🚀 AP Repair System - GitHub Upload Script"
echo "=========================================="

# ตรวจสอบสถานะ Git
echo "📋 ตรวจสอบสถานะ Git..."
git status

echo ""
echo "📝 กรุณาใส่ชื่อผู้ใช้ GitHub ของคุณ:"
read -p "GitHub Username: " github_username

if [ -z "$github_username" ]; then
    echo "❌ ไม่ได้ใส่ชื่อผู้ใช้ GitHub"
    exit 1
fi

echo ""
echo "🔧 เริ่มต้นการอัปโหลด..."
echo "Repository URL: https://github.com/$github_username/ap-repaire.git"

# ลบ remote เดิม
echo "📤 ลบ remote เดิม..."
git remote remove origin

# เพิ่ม remote ใหม่
echo "📥 เพิ่ม remote ใหม่..."
git remote add origin https://github.com/$github_username/ap-repaire.git

# ตรวจสอบ remote
echo "🔍 ตรวจสอบ remote..."
git remote -v

# อัปโหลดไปยัง GitHub
echo "🚀 อัปโหลดไปยัง GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ อัปโหลดสำเร็จ!"
    echo "🌐 Repository URL: https://github.com/$github_username/ap-repaire"
    echo ""
    echo "📋 ขั้นตอนต่อไป:"
    echo "1. ไปที่ https://github.com/$github_username/ap-repaire"
    echo "2. ตรวจสอบว่าไฟล์ทั้งหมดถูกอัปโหลดแล้ว"
    echo "3. ตรวจสอบ README.md แสดงผลถูกต้อง"
    echo "4. ตั้งค่า Topics และ Description (ถ้าต้องการ)"
else
    echo ""
    echo "❌ อัปโหลดล้มเหลว!"
    echo "🔍 ตรวจสอบ:"
    echo "1. ชื่อผู้ใช้ GitHub ถูกต้อง"
    echo "2. Repository ถูกสร้างแล้ว"
    echo "3. มีสิทธิ์ในการ push"
    echo "4. Authentication ถูกต้อง"
fi
