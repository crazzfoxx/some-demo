����

//////////////���˵�/////////////////
[����վ clickedId == 9]

	1/ ����վ�ڲ��ܴ����ļ���
	2/ ����վ�ڲ�������
	3/ ����վ���ļ�����"����"(?)
	4/ ����վ��ֻ���б���ʾ
	5/ ����վ�ڿ��Խ��� "��ԭ" "����ɾ��" ����
		5.1/ ���Ҽ��˵��в���
		5.2/ ��content-info�в���

[���˵�"ȫ���ļ�"�� clickedId == 1]

	1/ �����ʾȫ���ļ�/�ļ���

[���˵�"ȫ���ļ�"�� clickedId == 8]
	1/ ����

[���˵������� clickedId == 2-7]

	1/ �����ʾ�÷����µ�ȫ���ļ�

//////////////���˵� end/////////////////

//////////////user-info/////////////////
	
	1/ "wanna play games" ����

	1/ �ƶ���user-info�ϵ���pop��,
           �Ƴ���ʱ����pop��
	
  	2/ "�ͻ�������"  ����

	3/ "system-info" ϵͳ֪ͨ 
	   "feedback"    �ظ�
	   "night-mode"  ��ҹģʽ
	
	4/ "smash it"    ����

//////////////user-info end/////////////////

//////////////content-header/////////////////
	1/ "�ϴ�"

	2/ "�½��ļ���"

	3/ "����"

	4/ "�ҵ��豸"     ����

	5/ content-op     Ĭ������/�����ļ�ѡ�е��������ʾ
		5.1/ "����"   ����
		5.2/ "����"   
		5.3/ "ɾ��"   ɾ�� ���� (ѡ���ļ� �� �ļ��м����Ӽ������ļ�/�ļ���)
		5.4/ "������"
		5.5/ "���Ƶ�"
		5.6/ "�ƶ���"
		5.7/ "����"   ����

	6/ content-search ������ƥ�����������ؼ��ֵ��ļ�/�ļ���
		6.1/ �ļ�/�ļ����ַ�������: title + fileType + time.date

	7/ content-sort   ����
		7.1/ ��localCompare���а��ļ���(����) (?)
		7.2/ ��sort��ʱ������ 

	8/ content-display ��ʾģʽ
		8.1/ ͨ���л�content��class�ı䲻ͬ��ʽ
		8.2/ class="content content-list"��ʾ�б�ģʽ
		8.3/ class="content content-icon"��ʾͼ��ģʽ

//////////////content-header end/////////////////

//////////////content-info/////////////////
	1/ path        ��¼�ļ�����·��,���span���Ի���
	2/ load        ��ʾ�ļ��������
	3/ checkall	   
		3.1/ check-btn ȫѡ��ť
		3.2/ check-text ��ʾѡ�����

//////////////content-info end/////////////////

//////////////content/////////////////
	1/ item(dl)
		����:
			1.1/ dt                   ����ļ�ͼƬ,����type��filetype�л�ͼ��
			1.2/ dd					  ����ļ���
			////ֻ��content-list�¿ɼ�
			1.3/ content-list-op      �ļ��б����
			1.4/ content-list-size	  ��ʾ�ļ���С
			1.5/ content-list-time	  ��ʾ�ļ�ʱ��
			////ֻ��content-list�¿ɼ� end
			1.6/ span                 checkboxģ��
		����:
			1.1/ hover�ı�item����
			1.2/ �״ε���spanѡ���ļ�,
				 	span -> .checkbox-active   ѡ��checkbox
				 	item -> .item .item-active ѡ��item

				 �ٴε���spanȡ��ѡ���ļ�,
				 	span -> ''                 ȡ��ѡ��checkbox
				 	item -> .item  			   ȡ��ѡ��item
			1.3/ ˫��item,
				1.3.1/ �����ļ� type == 'folder' ������һ���˵�
				1.3.2/ �����ļ� type == 'file' ��ֹ�����¼��˵�/ѡ��ʽ���ļ�
			1.4/ ���item���϶�
				1.4.1/ ����clone���϶�
				1.4.2/ �����е�ǰĿ¼�µ��ļ�(���Ͻ�)��ײ���,�������true��targetId��Ч,�����ļ��ƶ���Ŀ���ļ�(��targetIdָ��)��;
				1.4.3/ ɾ��clone
			1.5/ �һ�item�����Զ���˵�
				1.5.1/ ��clickedId == 9 �� �����������ʾ��ͬ����
	
	2/ content��ʾ��������fillcontent()����ˢ�� 

//////////////content end/////////////////

��ǰ����2-20
	1)������delete��blur��ͻ(?)

	2)findAllSubs��Ҫ���һ��return(?)

	3)[solved]ɾ�������ƶ�������վ

	4)[solved]�ƶ����ݺ�content-opû����ʧ 

	5)���ȫѡ�뵥��ȫѡ��ͻ

	6)[solved]��дfillContent():�����ݻ�ȡ��ҳ�����ɷ���,�����������

	7)��str.sort (function(a,b){return a.localeCompare(b)})��������

	8)[solved]��дdata

	9)[solved]���sprite�ڲ�ͬ��ʾģʽ��λ�ù�ϵ

	10)�ѽ����'����'����

	11)[solved]ҳ���С���ſ�����

	12)[solved]1435��ΪʲôҪ��if(){}���� 
		�ж�ֻ������ļ��б�ָ�����վ
	
	13)��ͬ���content-info-pathˢ������

	14)[solved]movetoFooterConfirm.onclick()�ظ���������
		movetoFooterConfirmִ�н�����û����(targetId = -1)

	15)���������ҵ������ļ���

	16)sublime�༭���ı���������




	    





















