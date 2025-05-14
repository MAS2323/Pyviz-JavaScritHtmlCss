# Instruccion sql para hacer el insert de todos los datos del sistema

```sql
SET FOREIGN_KEY_CHECKS = 0;

-- Step 4: Insert into control_frames first (no dependencies)
- Step 16: Insert into control_frames first (no dependencies)
INSERT INTO control_frames (cmdFlg, gId, param, length, `values`, timestamp) VALUES
(1, 1001, 101, 64, X'53494E43485349474E414C', '2025-04-30 10:00:00'),
(1, 1002, 102, 64, X'53494E43485349474E414C', '2025-04-30 10:01:00'),
(1, 1003, 103, 64, X'53494E43485349474E414C', '2025-04-30 10:02:00'),
(1, 1004, 104, 64, X'53494E43485349474E414C', '2025-04-30 10:03:00');

-- Step 17: Insert into device_info with coordinates forming a square
INSERT INTO device_info (sn, gId, name, city, location, longitude, lattitude, Producer) VALUES
('DEV-1001', 1001, '郑州局', '郑州', '郑州局，郑州市', 113.521, 35.148, 'Nokia'),
('DEV-1002', 1002, '洛阳局', '洛阳', '洛阳局，洛阳市', 113.521, 34.148, 'Huawei'),
('DEV-1003', 1003, '开封站', '开封', '开封站，开封市', 114.521, 35.148, 'TZT'),
('DEV-1004', 1004, '商丘调度', '商丘', '商丘调度，商丘市', 114.521, 34.148, 'ZTE');

-- Step 18: Insert into sdh_dev_info (references device_info)
INSERT INTO sdh_dev_info (sn, gId, tagId, Type) VALUES
('SDH-1001', 1001, 'FIB-TAG-1001', 'SDH'),
('SDH-1002', 1002, 'FIB-TAG-1002', 'SDH'),
('SDH-1003', 1003, 'FIB-TAG-1003', 'SDH'),
('SDH-1004', 1004, 'FIB-TAG-1004', 'SDH');

-- Step 19: Insert into iolp_dev_info (references device_info)
INSERT INTO iolp_dev_info (sn, gId, tagId, Type) VALUES
('IOLP-1001', 1001, 'FIB-TAG-1001', 'IOLP'),
('IOLP-1002', 1002, 'FIB-TAG-1002', 'IOLP'),
('IOLP-1003', 1003, 'FIB-TAG-1003', 'IOLP'),
('IOLP-1004', 1004, 'FIB-TAG-1004', 'IOLP');

-- Step 20: Insert into traffstub_dev_info (references device_info)
INSERT INTO traffstub_dev_info (sn, gId, tagId, Type) VALUES
('TS-1001', 1001, 'FIB-TAG-1001', 'TraffStub'),
('TS-1002', 1002, 'FIB-TAG-1002', 'TraffStub'),
('TS-1003', 1003, 'FIB-TAG-1003', 'TraffStub'),
('TS-1004', 1004, 'FIB-TAG-1004', 'TraffStub');

-- Step 21: Insert into jmpmat (references sdh_dev_info and iolp_dev_info)
INSERT INTO jmpmat (gId, actNum, maxPorts, actMap, sdh_sn, iolp_sn, sn) VALUES
(1001, 4, 8, '1,2,3,4', 'SDH-1001', 'IOLP-1001', 'JMP-001'),
(1002, 4, 8, '1,2,3,4', 'SDH-1002', 'IOLP-1002', 'JMP-002'),
(1003, 4, 8, '1,2,3,4', 'SDH-1003', 'IOLP-1003', 'JMP-003'),
(1004, 4, 8, '1,2,3,4', 'SDH-1004', 'IOLP-1004', 'JMP-004');

-- Step 22: Insert into fibcab_dev_info with square topology
INSERT INTO fibcab_dev_info (sn, gId, tagId, Type, name, total_fiber_number, connected_fiber_number, connected_array, suspended_fiber_number, suspended_array, cable_temp, source_sn, target_sn) VALUES
('FIB-1001', 1001, 'FIB-TAG-1001', 'Fibcab', '郑州至洛阳光缆', 62, 62, '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62', 0, '', 24, 'DEV-1001', 'DEV-1002'),
('FIB-1002', 1002, 'FIB-TAG-1002', 'Fibcab', '洛阳至商丘光缆', 62, 62, '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62', 0, '', 24, 'DEV-1002', 'DEV-1004'),
('FIB-1003', 1003, 'FIB-TAG-1003', 'Fibcab', '商丘至开封光缆', 62, 62, '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62', 0, '', 24, 'DEV-1004', 'DEV-1003'),
('FIB-1004', 1004, 'FIB-TAG-1004', 'Fibcab', '开封至郑州光缆', 62, 62, '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62', 0, '', 24, 'DEV-1003', 'DEV-1001');

-- Step 23: Insert into fibcab_dev_config
INSERT INTO fibcab_dev_config (sn, ficab_capacity, opt1_active_fc_map, opt1_inactive_fic_map, opt2_fibcab_perfrmace, opt2_fiber_attnuetion_coeff, opt3_connector_loss, opt3_splice_loss, opt_fibr_tem_state) VALUES
('FIB-1001', 62, '1,2,3,4,5,6,7,8,9,10', '', 'High', 0.2, 0.1, 0.05, 'Normal'),
('FIB-1002', 62, '1,2,3,4,5,6,7,8,9,10', '', 'Medium', 0.25, 0.15, 0.06, 'Normal'),
('FIB-1003', 62, '1,2,3,4,5,6,7,8,9,10', '', 'High', 0.2, 0.1, 0.05, 'Normal'),
('FIB-1004', 62, '1,2,3,4,5,6,7,8,9,10', '', 'High', 0.2, 0.1, 0.05, 'Normal');

-- Step 24: Insert into fibcab_dev_state
INSERT INTO fibcab_dev_state (sn, recordId, health_point, warnings, crisis, warnlog_url, crislog_url, rawfile_url) VALUES
('FIB-1001', 1, 95, '光纤温度轻微波动', NULL, 'http://logs.example.com/warn/fib-1001', NULL, 'http://raw.example.com/fib-1001'),
('FIB-1002', 1, 90, '第10号光纤信号丢失', NULL, 'http://logs.example.com/warn/fib-1002', NULL, 'http://raw.example.com/fib-1002'),
('FIB-1003', 1, 98, NULL, NULL, NULL, NULL, 'http://raw.example.com/fib-1003'),
('FIB-1004', 1, 95, NULL, NULL, NULL, NULL, 'http://raw.example.com/fib-1004');

-- Step 25: Insert into iolp_dev_config (update connections to reflect square topology)
INSERT INTO iolp_dev_config (sn, switch_vec, actived_pairs, inactived_pairs, in2dev_gId, in2dev_connmap, out2dev_gId, out2dev_connmap, thermsensor_id) VALUES
('DEV-1001', '1,0,1', '1-2,3-4', '5-6', 1003, '1:1,2:2', 1002, '3:1,4:2', 'THERM-1001'),
('DEV-1002', '0,1,1', '1-3,2-4', '5-7', 1001, '1:3,2:4', 1004, '3:3,4:4', 'THERM-1002'),
('DEV-1003', '1,1,0', '1-5,2-6', '3-4', 1004, '1:5,2:6', 1001, '5:5,6:6', 'THERM-1003'),
('DEV-1004', '1,1,1', '1-2,3-4', '5-6', 1002, '1:1,2:2', 1003, '3:1,4:2', 'THERM-1004');

-- Step 26: Insert into iolp_dev_state
INSERT INTO iolp_dev_state (sn, recordId, health_point, warnings, crisis, warnlog_url, crislog_url, rawfile_url, opt_pow_mean, opt_pow_var, opt_pow_max, opt_pow_min) VALUES
('DEV-1001', 1, 92, '第1-2对光功率偏低', NULL, 'http://logs.example.com/warn/iolp-1001', NULL, 'http://raw.example.com/iolp-1001', 3.5, 0.2, 3.8, 3.2),
('DEV-1002', 1, 88, '第2-4对间歇性连接问题', NULL, 'http://logs.example.com/warn/iolp-1002', NULL, 'http://raw.example.com/iolp-1002', 3.7, 0.3, 4.0, 3.4),
('DEV-1003', 1, 95, NULL, NULL, NULL, NULL, 'http://raw.example.com/iolp-1003', 3.6, 0.1, 3.9, 3.3),
('DEV-1004', 1, 90, '光功率波动较大', NULL, 'http://logs.example.com/warn/iolp-1004', NULL, 'http://raw.example.com/iolp-1004', 3.4, 0.4, 3.9, 3.0);

-- Step 27: Insert into sdh_dev_config with updated directional names
INSERT INTO sdh_dev_config (sn, opt1_dir_name, opt1_dir_gId, opt1_trans_type, opt1_traffic, opt2_dir_name, opt2_dir_gId, opt2_trans_type, opt2_traffic) VALUES
('DEV-1001', '郑州至洛阳方向', 1001, 'STM-16', 'High', '开封至郑州方向', 1003, 'STM-16', 'Medium'),
('DEV-1002', '洛阳至商丘方向', 1002, 'STM-4', 'Medium', '郑州至洛阳方向', 1001, 'STM-4', 'Low'),
('DEV-1003', '开封至郑州方向', 1003, 'STM-16', 'High', '商丘至开封方向', 1004, 'STM-16', 'High'),
('DEV-1004', '商丘至开封方向', 1004, 'STM-64', 'High', '洛阳至商丘方向', 1002, 'STM-64', 'High');

-- Step 28: Insert into sdh_dev_state
INSERT INTO sdh_dev_state (sn, recordId, health_point, warnings, crisis, warnlog_url, crislog_url, rawfile_url) VALUES
('DEV-1001', 1, 90, '方向1延迟较高', NULL, 'http://logs.example.com/warn/sdh-1001', NULL, 'http://raw.example.com/sdh-1001'),
('DEV-1002', 1, 85, '方向2有数据包丢失', NULL, 'http://logs.example.com/warn/sdh-1002', NULL, 'http://raw.example.com/sdh-1002'),
('DEV-1003', 1, 93, NULL, NULL, NULL, NULL, 'http://raw.example.com/sdh-1003'),
('DEV-1004', 1, 88, '流量轻微过载', NULL, 'http://logs.example.com/warn/sdh-1004', NULL, 'http://raw.example.com/sdh-1004');

-- Step 29: Insert into traffstub_dev_config (update connections to reflect square topology)
INSERT INTO traffstub_dev_config (sn, txer_Id, txer_destaddr, txer_pkgrate, rxer_Id, rxer_srcaddr, rxer_pkgrate) VALUES
('DEV-1001', 'TX-1001', 'DEV-1002', '1000', 'RX-1001', 'DEV-1003', '800'),
('DEV-1002', 'TX-1002', 'DEV-1004', '500', 'RX-1002', 'DEV-1001', '400'),
('DEV-1003', 'TX-1003', 'DEV-1001', '1000', 'RX-1003', 'DEV-1004', '900'),
('DEV-1004', 'TX-1004', 'DEV-1003', '2000', 'RX-1004', 'DEV-1002', '1800');

-- Step 30: Insert into traffstub_dev_state
INSERT INTO traffstub_dev_state (sn, recordId, health_point, warnings, crisis, warnlog_url, crislog_url, rawfile_url, timestamp) VALUES
('DEV-1001', 1, 91, '高带宽使用率', NULL, 'http://logs.example.com/warn/ts-1001', NULL, 'http://raw.example.com/ts-1001', '2025-04-30 10:00:00'),
('DEV-1002', 1, 87, '间歇性流量下降', NULL, 'http://logs.example.com/warn/ts-1002', NULL, 'http://raw.example.com/ts-1002', '2025-04-30 10:01:00'),
('DEV-1003', 1, 94, NULL, NULL, NULL, NULL, 'http://raw.example.com/ts-1003', '2025-04-30 10:02:00'),
('DEV-1004', 1, 89, '流量过载', NULL, 'http://logs.example.com/warn/ts-1004', NULL, 'http://raw.example.com/ts-1004', '2025-04-30 10:03:00');   
```
