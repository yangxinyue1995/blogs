package com.org.blogs.util.encode;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.log4j.Logger;

public class MutiPatternParser {
	
	Logger log = Logger.getLogger(MutiPatternParser.class);

	private static MutiPatternParser parser = new MutiPatternParser();
	private MutiPatternParser() {
		// 初始化关键字
		initfiltercode();
	}
	
	public static MutiPatternParser getInstance(){
		return parser;
	}

	/**
	 * 敏感词集合 {法={isEnd=0, 轮={isEnd=1}}, 中={isEnd=0, 国={isEnd=0, 人={isEnd=1},
	 * 男={isEnd=0, 人={isEnd=1}}}}}
	 * */
	private HashMap keysMap = new HashMap();

	/**
	 * 添加敏感词
	 * 
	 * @param keywords
	 */
	private void addKeywords(List<String> keywords) {
		for (int i = 0; i < keywords.size(); i++) {
			String key = keywords.get(i).trim();
			HashMap nowhash = keysMap;// 初始从最外层遍历
			for (int j = 0; j < key.length(); j++) {
				char word = key.charAt(j);
				Object wordMap = nowhash.get(word);
				if (wordMap != null) {
					nowhash = (HashMap) wordMap;
				} else {
					HashMap<String, String> newWordHash = new HashMap<String, String>();
					newWordHash.put("isEnd", "0");
					nowhash.put(word, newWordHash);
					nowhash = newWordHash;
				}
				if (j == key.length() - 1) {
					nowhash.put("isEnd", "1");
				}
			}
		}
	}

	/**
	 * 检查一个字符串从begin位置起开始是否有keyword符合， 如果没有，则返回0 如果有符合的keyword值，继续遍历，直至遇到isEnd =
	 * 1，返回匹配的keyword的长度，
	 */
	private int checkKeyWords(String txt, int begin) {
		HashMap nowhash = keysMap;
		int res = 0;
		for (int i = begin; i < txt.length(); i++) {
			char word = txt.charAt(i);
			Object wordMap = nowhash.get(word);// 得到该字符对应的HashMap
			if (wordMap == null) {
				return 0;// 如果该字符没有对应的HashMap，return 0
			}

			res++;// 如果该字符对应的HashMap不为null，说明匹配到了一个字符，+1
			nowhash = (HashMap) wordMap;// 将遍历的HashMap指向该字符对应的HashMap
			if (((String) nowhash.get("isEnd")).equals("1")) {// 如果该字符为敏感词的结束字符，直接返回
				return res;
			} else {
				continue;
			}
		}
		return res;
	}

	/**
	 * 判断txt中是否有关键字
	 */
	public boolean isContentKeyWords(String txt) {
		for (int i = 0; i < txt.length(); i++) {
			int len = checkKeyWords(txt, i);
			if (len > 0) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 返回txt中关键字的列表
	 */
	public List<String> getTxtKeyWords(String txt) {
		List<String> list = new ArrayList<String>();
		int l = txt.length();
		for (int i = 0; i < l;) {
			int len = checkKeyWords(txt, i);
			if (len > 0) {
				String tt = txt.substring(i, i + len);
				list.add(tt);
				i += len;
			} else {
				i++;
			}
		}
		return list;
	}

	/**
	 * 初始化敏感词列表
	 * */
	private void initfiltercode() {
		List<String> keywords = new ArrayList<String>();
		BufferedReader brKeyword = TxtReader
				.keywordReader("/keyword/illegalkeyword.txt");
		String keyword = null;
		long startTime = System.currentTimeMillis();
		try {
			while ((keyword = brKeyword.readLine()) != null) {
				keywords.add(keyword);
			} 
		} catch (IOException e) {
			log.error("读取敏感字文件IO异常!!!",e);
		}
		  
		long endTime = System.currentTimeMillis();

		log.debug("Read DFA Filter Cost:" + (endTime - startTime) + "ms");

		this.addKeywords(keywords);
	} 
}
