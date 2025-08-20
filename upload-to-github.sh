#!/bin/bash

# GitHub Upload Script for AP Repair System
# ใช้สำหรับอัปโหลดโปรเจคขึ้น GitHub

echo "🚀 AP Repair System - GitHub Upload Script"
echo "=========================================="

# ตรวจสอบสถานะ Git
echo "📋 ตรวจสอบสถานะ Git..."
git status

echo ""
echo "📝 ขั้นตอนการอัปโหลด GitHub:"
echo "1. สร้าง Repository บน GitHub"
echo "2. แทนที่ YOUR_USERNAME ในคำสั่งด้านล่าง"
echo "3. รันคำสั่งต่อไปนี้:"
echo ""

echo "🔧 คำสั่งที่ต้องรัน:"
echo "=========================================="
echo "# ลบ remote เดิม"
echo "git remote remove origin"
echo ""
echo "# เพิ่ม remote ใหม่ (แทนที่ YOUR_USERNAME)"
echo "git remote add origin https://github.com/YOUR_USERNAME/ap-repaire.git"
echo ""
echo "# ตรวจสอบ remote"
echo "git remote -v"
echo ""
echo "# อัปโหลดไปยัง GitHub"
echo "git push -u origin main"
echo "=========================================="

echo ""
echo "📋 ข้อมูลสำคัญ:"
echo "- Repository Name: ap-repaire"
echo "- Branch: main"
echo "- Total Files: 48 files"
echo "- Total Lines: 9,449 lines"
echo ""
echo "📖 ดูคำแนะนำเพิ่มเติมในไฟล์:"
echo "- UPLOAD_TO_GITHUB.md"
echo "- GITHUB_SETUP.md"
echo "- GITHUB_UPLOAD_SUMMARY.md"
echo ""
echo "✅ โปรเจคพร้อมอัปโหลด GitHub!"
